"use client";

import { useEffect, useRef, useState } from "react";

import {
  CHAPTERS,
  sampleJoints,
  type ChapterId,
} from "@/data/robot";
import {
  FrameSequence,
  loadManifest,
  type FrameAsset,
  type FrameSet,
  type RobotFrameManifest,
} from "@/lib/frames";
import {
  control,
  isOkActive,
  isWaveActive,
  publishRobot,
  triggerWave,
  type RobotMode,
} from "@/lib/robot-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DEFAULT_TOTAL = 240;
const HEADER_OFFSET = 0.5; // section top meets mid-viewport

type Range = {
  id: ChapterId;
  from: number;
  to: number;
  start: number;
  end: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const rad = (deg: number) => (deg * Math.PI) / 180;

function assetSize(asset: FrameAsset): { w: number; h: number } {
  if ("naturalWidth" in asset) {
    return { w: asset.naturalWidth, h: asset.naturalHeight };
  }
  return { w: asset.width, h: asset.height };
}

export function RobotBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<RobotMode>("procedural");
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Narrowed aliases so nested loop functions keep the non-null types.
    const el: HTMLCanvasElement = canvas;
    const g: CanvasRenderingContext2D = ctx;
    const layerEl: HTMLDivElement = layer;

    // ---- mutable animation state -------------------------------------
    let current = 0; // smoothed frame
    let progress = 0; // global scroll progress
    let chapter: ChapterId = "sobre";
    let chapterT = 0;
    let joints: [number, number, number] = [12, -22, 16];
    let gripper: "OPEN" | "CLOSED" = "CLOSED";

    const mouse = { x: 0, y: 0 }; // target parallax, -1..1
    const par = { x: 0, y: 0 }; // eased parallax offset

    let running = false;
    let frameId = 0;
    let lastPublish = 0;
    let lastRanges = 0;
    let disposed = false;

    let bgColor = "#e4e3df";
    let isMobile = window.innerWidth < 768;

    let sequence: FrameSequence | null = null;
    let asset: FrameAsset | null = null;
    let manifest: RobotFrameManifest | null = null;

    let ranges: Range[] = [];
    let total = DEFAULT_TOTAL;

    const activeChapters = () =>
      CHAPTERS.map((c) => {
        const m = manifest?.chapters?.find((x) => x.id === c.id);
        return { ...c, from: m?.from ?? c.from, to: m?.to ?? c.to };
      });

    let chapters = activeChapters();

    function computeRanges() {
      const vh = window.innerHeight;
      ranges = chapters.map((c) => {
        const el = document.getElementById(c.anchor);
        const top = el
          ? el.getBoundingClientRect().top + window.scrollY
          : 0;
        const height = el ? el.offsetHeight : vh;
        return {
          id: c.id,
          from: c.from,
          to: c.to,
          start: top - vh * HEADER_OFFSET,
          end: top + height - vh * HEADER_OFFSET,
        };
      });
      lastRanges = performance.now();
    }

    function readBg() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg")
        .trim();
      if (v) bgColor = v;
    }

    // ---- scroll → frame mapping --------------------------------------
    function targetFor(scrollY: number) {
      if (ranges.length === 0) return { frame: 0, chapter: "sobre" as ChapterId, t: 0 };

      let chosen = ranges[0];
      for (const r of ranges) {
        if (scrollY >= r.start) chosen = r;
      }

      if (control.hold) {
        chosen = ranges.find((r) => r.id === control.hold) ?? chosen;
      }

      const span = Math.max(1, chosen.end - chosen.start);
      const t = clamp01((scrollY - chosen.start) / span);
      const frame = chosen.from + t * (chosen.to - chosen.from);
      return { frame, chapter: chosen.id, t };
    }

    // ---- scheduling ---------------------------------------------------
    function tick() {
      running = false;
      if (disposed) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - vh,
      );
      progress = clamp01(scrollY / maxScroll);

      if (performance.now() - lastRanges > 200) computeRanges();

      const mapped = targetFor(scrollY);
      let nextTarget = mapped.frame;
      chapter = mapped.chapter;
      chapterT = mapped.t;

      // Impulse windows (project-card hover / form focus).
      const t = performance.now();
      if (control.impulseUntil > t) nextTarget += control.impulse;
      else control.impulse = 0;

      // OK gesture after a successful submit — a short 12-frame loop.
      if (isOkActive()) {
        const c = ranges.find((r) => r.id === "contato");
        if (c) {
          const cycle = Math.floor(t / 90) % 12;
          nextTarget = c.to - 12 + cycle;
          chapter = "contato";
          chapterT = 0.9;
        }
      }

      // Wave easter egg — the last frames of the timeline.
      if (isWaveActive()) {
        const from = manifest?.easterEgg?.from ?? total - 22;
        const to = manifest?.easterEgg?.to ?? total;
        const cycle = (t / 700) % 1;
        nextTarget = from + (0.5 + 0.5 * Math.sin(cycle * Math.PI * 2)) * (to - from);
        chapter = "contato";
        chapterT = 0.5;
      }

      if (reducedRef.current) {
        nextTarget = Math.round(nextTarget);
        current = nextTarget;
      } else {
        current += (nextTarget - current) * 0.12;
      }

      // Eased mouse parallax (disabled for reduced motion / touch).
      if (!reducedRef.current && !isMobile) {
        par.x += (mouse.x * 12 - par.x) * 0.08;
        par.y += (mouse.y * 8 - par.y) * 0.08;
        const rot = mouse.x * 0.5;
        el.style.transform = `translate3d(${par.x.toFixed(2)}px, ${par.y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      } else {
        el.style.transform = "";
      }

      // Pose for the HUD + procedural drawing.
      const poseT = reducedRef.current ? 0.5 : chapterT;
      const pose = sampleJoints(chapter, poseT);
      joints = pose.joints;
      gripper = pose.gripper;

      // If the easter egg or OK gesture is running, animate the gripper.
      if (isWaveActive()) gripper = ((t / 300) % 2) < 1 ? "OPEN" : "CLOSED";
      if (isOkActive()) gripper = ((t / 120) % 2) < 1 ? "OPEN" : "CLOSED";

      draw(t);

      if (t - lastPublish > 60) {
        lastPublish = t;
        publishRobot({
          frame: current,
          total,
          progress,
          chapter,
          chapterProgress: chapterT,
          joints,
          gripper,
          mode: manifest ? "frames" : "procedural",
          ready: manifest ? (sequence?.ready ?? false) : true,
          reduced: reducedRef.current,
        });
      }

      const settled =
        Math.abs(nextTarget - current) < 0.01 &&
        Math.abs(mouse.x * 12 - par.x) < 0.05 &&
        !isOkActive() &&
        !isWaveActive() &&
        control.impulse === 0;

      if (!settled && document.visibilityState === "visible") {
        running = true;
        frameId = requestAnimationFrame(tick);
      }
    }

    function wake() {
      if (disposed) return;
      if (running) return;
      if (document.visibilityState !== "visible") return;
      running = true;
      frameId = requestAnimationFrame(tick);
    }

    // ---- canvas sizing -------------------------------------------------
    function resize() {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      el.width = Math.max(1, Math.floor(rect.width * dpr));
      el.height = Math.max(1, Math.floor(rect.height * dpr));
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      isMobile = window.innerWidth < 768;
      computeRanges();
      wake();
    }

    // ---- painting ------------------------------------------------------
    function draw(time: number) {
      const rect = el.getBoundingClientRect();
      const cw = rect.width;
      const chh = rect.height;
      g.clearRect(0, 0, cw, chh);
      g.fillStyle = bgColor;
      g.fillRect(0, 0, cw, chh);

      if (manifest && sequence) {
        const nextAsset = sequence.getFrame(Math.round(current));
        if (nextAsset) asset = nextAsset;
        if (asset) {
          const { w, h } = assetSize(asset);
          const scale = Math.max(cw / w, chh / h);
          const dw = w * scale;
          const dh = h * scale;
          const dx = (cw - dw) / 2 + (isMobile ? 0 : cw * 0.12);
          const dy = (chh - dh) / 2;
          g.drawImage(asset, dx, dy, dw, dh);
        }
      } else {
        drawProcedural(g, cw, chh, chapter, reducedRef.current ? 0.5 : chapterT, gripper, time, isMobile);
      }
    }

    // ---- frame loading ---------------------------------------------------
    async function boot() {
      readBg();
      const loaded = await loadManifest();
      if (disposed) return;

      if (!loaded) {
        setMode("procedural");
        computeRanges();
        publishRobot({
          mode: "procedural",
          ready: true,
          total: DEFAULT_TOTAL,
          loaded: 0,
          toLoad: 0,
        });
        wake();
        return;
      }

      manifest = loaded;
      total = loaded.count;
      chapters = activeChapters();
      const set: FrameSet = isMobile ? "mobile" : "desktop";
      const seq = new FrameSequence(loaded, { step: isMobile ? 2 : 1 });
      seq.set = set;
      sequence = seq;
      setMode("frames");
      computeRanges();

      try {
        await seq.load(
          (done, count) => {
            publishRobot({ loaded: done, toLoad: count, total, mode: "frames" });
          },
          () => wake(),
        );
        if (disposed) return;
        publishRobot({ ready: true, mode: "frames", total });
      } catch {
        // Frames missing despite a valid manifest → fall back cleanly.
        seq.dispose();
        sequence = null;
        manifest = null;
        setMode("procedural");
        publishRobot({ mode: "procedural", ready: true, total: DEFAULT_TOTAL });
      }
      wake();
    }

    // ---- listeners -------------------------------------------------------
    const onScroll = () => wake();
    const onResize = () => resize();
    const onMouse = (e: MouseEvent) => {
      if (reducedRef.current || isMobile) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") wake();
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a,button,input,textarea,label,select,[role='button']",
      );
      if (interactive) return;
      if (el.closest("[data-robot-tap]") || el === document.body) {
        triggerWave();
        wake();
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(layerEl);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibility);
    const themeObserver = new MutationObserver(readBg);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    boot();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (sequence) sequence.dispose();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg md:inset-3 md:rounded-[26px]"
    >
      <canvas
        ref={canvasRef}
        className="absolute -left-[3%] -top-[3%] h-[106%] w-[106%] will-change-transform"
      />
      {/* Mobile legibility veil over the robot. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/70 to-bg/85 md:hidden" />
      {mode === "procedural" ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl]">
          <span className="label-mono-sm border border-dashed border-line bg-bg-panel/80 px-1.5 py-2 text-accent">
            PLACEHOLDER ROBOT — REPLACE WITH /public/frames
          </span>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Procedural fallback robot — a 3-segment articulated arm whose joint angles
// are driven by the same scroll mapping as the frame sequence.
// ---------------------------------------------------------------------------
function drawProcedural(
  g: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  chapter: ChapterId,
  t: number,
  gripper: "OPEN" | "CLOSED",
  time: number,
  isMobile: boolean,
) {
  const pose = sampleJoints(chapter, t);
  const [j0, j1, j2] = pose.joints;
  const open = gripper === "OPEN";

  const L = Math.min(cw, ch * 1.1);
  const l1 = L * 0.15;
  const l2 = L * 0.13;
  const l3 = L * 0.08;

  const ox = isMobile ? cw * 0.5 : cw * 0.66;
  const oy = ch * 0.76;

  const dir = (deg: number): [number, number] => [Math.sin(rad(deg)), -Math.cos(rad(deg))];
  const a1 = j0;
  const a2 = j0 + j1;
  const a3 = j0 + j1 + j2;

  const d1 = dir(a1);
  const d2 = dir(a2);
  const d3 = dir(a3);

  const shoulder: [number, number] = [ox, oy];
  const elbow: [number, number] = [shoulder[0] + d1[0] * l1, shoulder[1] + d1[1] * l1];
  const wrist: [number, number] = [elbow[0] + d2[0] * l2, elbow[1] + d2[1] * l2];
  const tip: [number, number] = [wrist[0] + d3[0] * l3, wrist[1] + d3[1] * l3];

  // Contact shadow
  g.save();
  g.fillStyle = "rgba(21,22,23,0.08)";
  g.beginPath();
  g.ellipse(ox, oy + L * 0.3, L * 0.14, L * 0.022, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Base plate
  g.save();
  g.fillStyle = "#e7e6e2";
  g.strokeStyle = "rgba(21,22,23,0.85)";
  g.lineWidth = 1.5;
  const bw = L * 0.22;
  const bh = L * 0.06;
  roundRect(g, ox - bw / 2, oy + L * 0.2, bw, bh, 6);
  g.fill();
  g.stroke();
  g.restore();

  // Sensor head with status LED
  const ledOn = ((time / 900) % 2) < 1;
  g.save();
  g.fillStyle = "#f5f4f0";
  roundRect(g, ox - bw * 0.28, oy + L * 0.13, bw * 0.56, bh * 0.9, 4);
  g.fill();
  g.stroke();
  g.fillStyle = ledOn ? "#ff5a1f" : "#8a8b8d";
  g.beginPath();
  g.arc(ox, oy + L * 0.13 + bh * 0.45, L * 0.009, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Arm segments as a thick rounded polyline with an outline pass
  const width = L * 0.026;
  const path = () => {
    g.beginPath();
    g.moveTo(shoulder[0], shoulder[1]);
    g.lineTo(elbow[0], elbow[1]);
    g.lineTo(wrist[0], wrist[1]);
    g.lineTo(tip[0], tip[1]);
  };
  g.save();
  g.lineJoin = "round";
  g.lineCap = "round";
  g.strokeStyle = "rgba(21,22,23,0.85)";
  g.lineWidth = width + 3;
  path();
  g.stroke();
  g.strokeStyle = "#f5f4f0";
  g.lineWidth = width;
  path();
  g.stroke();
  g.restore();

  // Joints
  const joints: [number, number][] = [shoulder, elbow, wrist];
  for (const [jx, jy] of joints) {
    g.save();
    g.fillStyle = "#1a1b1c";
    g.beginPath();
    g.arc(jx, jy, width * 0.62, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#f5f4f0";
    g.beginPath();
    g.arc(jx, jy, width * 0.26, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // Gripper jaws
  const spread = open ? 24 : 6;
  const finger = L * 0.045;
  g.save();
  g.strokeStyle = "#1a1b1c";
  g.lineWidth = width * 0.5;
  g.lineCap = "round";
  for (const s of [-1, 1]) {
    const ga = rad(a3 + s * spread);
    g.beginPath();
    g.moveTo(tip[0], tip[1]);
    g.lineTo(tip[0] + Math.sin(ga) * finger, tip[1] - Math.cos(ga) * finger);
    g.stroke();
  }
  g.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
