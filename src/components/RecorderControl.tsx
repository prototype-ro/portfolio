"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n-context";
import { Led } from "@/components/Led";
import { cn } from "@/lib/utils";

/**
 * Hardware-style "REC" module. Records the visitor's screen (or a single tab)
 * with the Screen Capture API and downloads a WebM. Hidden when the browser
 * does not support `getDisplayMedia` (most mobile browsers).
 */
export function RecorderControl() {
  const { t } = useI18n();
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" &&
        typeof navigator.mediaDevices?.getDisplayMedia === "function" &&
        typeof MediaRecorder !== "undefined",
    );
  }, []);

  // Stop timers/tracks if the component unmounts mid-recording.
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        rec.onstop = null; // don't trigger a download on unmount
        try {
          rec.stop();
        } catch {
          // ignore
        }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function reset() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setSeconds(0);
  }

  function pickMimeType(): string {
    const candidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    for (const type of candidates) {
      if (MediaRecorder.isTypeSupported?.(type)) return type;
    }
    return "";
  }

  function save() {
    const type = recorderRef.current?.mimeType || "video/webm";
    const blob = new Blob(chunksRef.current, { type });
    chunksRef.current = [];
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-rd01-${stamp}.webm`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    reset();
    toast.success(t("rec.saved"));
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 },
        audio: false,
      });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType
          ? { mimeType, videoBitsPerSecond: 12_000_000 }
          : undefined,
      );
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = save;

      // The browser's own "Stop sharing" button ends the track.
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (recorder.state !== "inactive") recorder.stop();
      });

      recorder.start(1000);
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(
        () => setSeconds((value) => value + 1),
        1000,
      );
      toast(t("rec.started"));
    } catch (error) {
      reset();
      // Cancelling the picker throws NotAllowedError — not worth a toast.
      if ((error as DOMException)?.name !== "NotAllowedError") {
        toast.error(t("rec.error"));
      }
    }
  }

  function stop() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }

  if (!supported) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="fixed bottom-16 left-3 z-40 md:bottom-20 md:left-6">
      <button
        type="button"
        onClick={recording ? stop : start}
        aria-pressed={recording}
        className={cn(
          "te-key chamfer flex items-center gap-2.5 border border-line bg-bg-panel/95 px-3 py-2 backdrop-blur-sm transition-colors hover:border-accent",
          recording && "border-accent",
        )}
      >
        <Led on={recording} blink={recording} />
        <span className="label-mono">
          {recording ? t("rec.stop") : t("rec.record")}
        </span>
        {recording ? (
          <span className="display-scroll text-xl leading-none tabular-nums text-accent-text">
            {mm}:{ss}
          </span>
        ) : null}
      </button>
    </div>
  );
}
