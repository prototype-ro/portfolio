import type { ChapterId } from "@/data/robot";

export type RobotMode = "frames" | "procedural";

export type RobotSnapshot = {
  /** Bumped on every publish so `useSyncExternalStore` re-renders. */
  version: number;
  /** Logical (float) frame the animation is heading to. */
  frame: number;
  total: number;
  /** Global scroll progress, 0..1. */
  progress: number;
  chapter: ChapterId;
  chapterProgress: number;
  joints: [number, number, number];
  gripper: "OPEN" | "CLOSED";
  mode: RobotMode;
  loaded: number;
  toLoad: number;
  ready: boolean;
  reduced: boolean;
  /** Currently active section id (IntersectionObserver). */
  active: string;
};

const initial: RobotSnapshot = {
  version: 0,
  frame: 0,
  total: 240,
  progress: 0,
  chapter: "sobre",
  chapterProgress: 0,
  joints: [12, -22, 16],
  gripper: "CLOSED",
  mode: "procedural",
  loaded: 0,
  toLoad: 0,
  ready: false,
  reduced: false,
  active: "sobre",
};

let snapshot: RobotSnapshot = initial;
const listeners = new Set<() => void>();

export function getRobotSnapshot(): RobotSnapshot {
  return snapshot;
}

export function getRobotServerSnapshot(): RobotSnapshot {
  return initial;
}

export function subscribeRobot(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishRobot(patch: Partial<RobotSnapshot>): void {
  snapshot = { ...snapshot, ...patch, version: snapshot.version + 1 };
  for (const listener of listeners) listener();
}

// ---------------------------------------------------------------------------
// Control channel — one-way commands from UI elements (hover, focus, submit)
// into the animation loop. Read on every frame, so it is a plain mutable box
// instead of React state.
// ---------------------------------------------------------------------------
export type RobotControl = {
  /** Additive frame nudge and the timestamp it expires at. */
  impulse: number;
  impulseUntil: number;
  /** Force the robot into a chapter regardless of scroll. */
  hold: ChapterId | null;
  /** OK mini-loop window after a successful submit. */
  okUntil: number;
  /** Wave easter-egg window. */
  waveUntil: number;
};

export const control: RobotControl = {
  impulse: 0,
  impulseUntil: 0,
  hold: null,
  okUntil: 0,
  waveUntil: 0,
};

const now = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

/** Temporarily push the target frame ("the robot reacts"). */
export function impulse(delta = 3, duration = 520): void {
  control.impulse = delta;
  control.impulseUntil = now() + duration;
}

export function holdChapter(id: ChapterId | null): void {
  control.hold = id;
}

export function triggerOkGesture(duration = 900): void {
  control.okUntil = now() + duration;
}

export function triggerWave(duration = 1600): void {
  control.waveUntil = now() + duration;
}

export function isOkActive(): boolean {
  return control.okUntil > now();
}

export function isWaveActive(): boolean {
  return control.waveUntil > now();
}
