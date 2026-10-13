import type { Localized } from "./i18n";

export type ChapterId = "sobre" | "projetos" | "experiencias" | "contato";

export type Chapter = {
  id: ChapterId;
  /** Anchor id used by the four page sections. */
  anchor: string;
  /** Index used in the section headers ("01 — SOBRE"). */
  index: string;
  label: Localized;
  /** Inclusive frame range. Overridden by manifest when frames exist. */
  from: number;
  to: number;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "sobre",
    anchor: "sobre",
    index: "01",
    label: { pt: "SOBRE", en: "ABOUT" },
    from: 0,
    to: 55,
  },
  {
    id: "projetos",
    anchor: "projetos",
    index: "02",
    label: { pt: "PROJETOS", en: "PROJECTS" },
    from: 56,
    to: 140,
  },
  {
    id: "experiencias",
    anchor: "experiencias",
    index: "03",
    label: { pt: "EXPERIÊNCIAS", en: "EXPERIENCE" },
    from: 141,
    to: 195,
  },
  {
    id: "contato",
    anchor: "contato",
    index: "04",
    label: { pt: "CONTATO", en: "CONTACT" },
    from: 196,
    to: 239,
  },
];

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

export function chapterById(id: ChapterId): Chapter {
  return CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0];
}

// ---------------------------------------------------------------------------
// Joint telemetry — angles (degrees) as a function of chapter progress [0,1].
// Used by both the procedural robot and the HUD readout, so the numbers the
// panel shows always match the pose being drawn.
// ---------------------------------------------------------------------------
export type JointKey = {
  t: number;
  joints: [number, number, number];
  gripper: "OPEN" | "CLOSED";
};

export const JOINT_KEYS: Record<ChapterId, JointKey[]> = {
  sobre: [
    { t: 0, joints: [12, -22, 16], gripper: "CLOSED" },
    { t: 0.5, joints: [34, -46, 22], gripper: "CLOSED" },
    { t: 1, joints: [58, -60, 12], gripper: "OPEN" },
  ],
  projetos: [
    { t: 0, joints: [58, -60, 12], gripper: "OPEN" },
    { t: 0.5, joints: [10, -20, 26], gripper: "CLOSED" },
    { t: 1, joints: [-38, 8, 32], gripper: "CLOSED" },
  ],
  experiencias: [
    { t: 0, joints: [-8, 18, 40], gripper: "OPEN" },
    { t: 0.35, joints: [-26, 34, 54], gripper: "OPEN" },
    { t: 0.6, joints: [-26, 34, 54], gripper: "CLOSED" },
    { t: 1, joints: [18, -8, 22], gripper: "CLOSED" },
  ],
  contato: [
    { t: 0, joints: [18, -8, 22], gripper: "CLOSED" },
    { t: 0.6, joints: [70, -74, 26], gripper: "OPEN" },
    { t: 1, joints: [86, -84, 30], gripper: "OPEN" },
  ],
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolate joint angles + gripper state for a chapter at progress t. */
export function sampleJoints(
  chapter: ChapterId,
  t: number,
): { joints: [number, number, number]; gripper: "OPEN" | "CLOSED" } {
  const keys = JOINT_KEYS[chapter];
  const p = clamp01(t);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p >= a.t && p <= b.t) {
      const local = (p - a.t) / Math.max(1e-6, b.t - a.t);
      return {
        joints: [
          lerp(a.joints[0], b.joints[0], local),
          lerp(a.joints[1], b.joints[1], local),
          lerp(a.joints[2], b.joints[2], local),
        ],
        gripper: local < 0.5 ? a.gripper : b.gripper,
      };
    }
  }
  const last = keys[keys.length - 1];
  return { joints: last.joints, gripper: last.gripper };
}

export function chapterForFrame(frame: number): ChapterId {
  const found = CHAPTERS.find((c) => frame >= c.from && frame <= c.to);
  return found?.id ?? "sobre";
}

/** Normalized progress of a frame inside its chapter. */
export function chapterProgress(frame: number): number {
  const c = chapterById(chapterForFrame(frame));
  return clamp01((frame - c.from) / Math.max(1, c.to - c.from));
}
