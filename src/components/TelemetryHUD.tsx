"use client";

import { useSyncExternalStore } from "react";

import {
  getRobotServerSnapshot,
  getRobotSnapshot,
  subscribeRobot,
} from "@/lib/robot-store";
import { useI18n } from "@/lib/i18n-context";
import { Led } from "@/components/Led";

function fmtAngle(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(1).padStart(5, "0")}°`;
}

function Cell({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span className={className}>
      <span className="text-ink-dim">{label} </span>
      <span className="tabular-nums text-ink">{value}</span>
    </span>
  );
}

/** Fixed hardware status bar carrying the background robot's telemetry. */
export function TelemetryHUD() {
  const { t } = useI18n();
  const s = useSyncExternalStore(
    subscribeRobot,
    getRobotSnapshot,
    getRobotServerSnapshot,
  );

  const frame = String(Math.round(s.frame)).padStart(4, "0");
  const total = String(s.total).padStart(4, "0");
  const scroll = String(Math.round(s.progress * 100)).padStart(3, "0");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg-panel/95 px-3 py-2 backdrop-blur-sm md:inset-x-3 md:bottom-3 md:border"
    >
      <div className="flex items-center gap-x-4 gap-y-1 overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] sm:flex-nowrap">
        <span className="flex shrink-0 items-center gap-2">
          <Led on blink={s.mode === "frames"} />
          <span className="label-mono-sm text-ink">{t("hud.title")}</span>
        </span>

        <Cell
          label={t("hud.frame")}
          value={`${frame}/${total}`}
          className="shrink-0"
        />
        <Cell
          label={t("hud.joint1")}
          value={fmtAngle(s.joints[0])}
          className="hidden shrink-0 md:inline"
        />
        <Cell
          label={t("hud.joint2")}
          value={fmtAngle(s.joints[1])}
          className="hidden shrink-0 md:inline"
        />
        <Cell
          label={t("hud.joint3")}
          value={fmtAngle(s.joints[2])}
          className="hidden shrink-0 lg:inline"
        />
        <Cell
          label={t("hud.gripper")}
          value={s.gripper === "OPEN" ? t("hud.open") : t("hud.closed")}
          className="hidden shrink-0 sm:inline"
        />
        <Cell
          label="MODE"
          value={s.mode === "frames" ? t("hud.mode.frames") : t("hud.mode.procedural")}
          className="hidden shrink-0 lg:inline"
        />

        <span className="ml-auto flex shrink-0 items-center gap-3">
          <Cell label={t("hud.scroll")} value={`${scroll}%`} />
          <span className="hidden h-1.5 w-24 border border-line bg-bg sm:block">
            <span
              className="block h-full bg-accent transition-[width] duration-150"
              style={{ width: `${Math.round(s.progress * 100)}%` }}
            />
          </span>
        </span>
      </div>

      {!s.ready && s.toLoad > 0 ? (
        <div className="mt-1 flex items-center gap-2">
          <span className="h-0.5 flex-1 bg-line">
            <span
              className="block h-full bg-accent transition-[width] duration-150"
              style={{ width: `${(s.loaded / Math.max(1, s.toLoad)) * 100}%` }}
            />
          </span>
          <span className="label-mono-sm whitespace-nowrap">
            {t("hud.loading")} {s.loaded}/{s.toLoad}
          </span>
        </div>
      ) : null}
    </div>
  );
}
