import type { ChapterId } from "@/data/robot";

export type RobotFrameManifest = {
  count: number;
  padding: number;
  ext: string;
  width: number;
  height: number;
  /** Root folder holding the `desktop/` and `mobile/` sets. */
  basePath?: string;
  /**
   * When true the shipped manifest documents the expected shape but the
   * frames are not rendered yet, so the procedural robot is used instead of
   * firing 240 doomed network requests. Set to false once frames exist.
   */
  placeholder?: boolean;
  chapters?: { id: ChapterId; from: number; to: number }[];
  anchors?: { frame: number; x: number; y: number; label: string }[];
  easterEgg?: { from: number; to: number };
};

export type FrameSet = "desktop" | "mobile";
export type FrameAsset = ImageBitmap | HTMLImageElement;

const MANIFEST_URL = "/frames/robot/manifest.json";

/**
 * Fetches the frame manifest. Returns `null` (→ procedural fallback) when the
 * file is missing, malformed, or explicitly flagged as a placeholder.
 */
export async function loadManifest(): Promise<RobotFrameManifest | null> {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as RobotFrameManifest;
    if (!data || typeof data.count !== "number" || data.count <= 0) return null;
    if (data.placeholder) return null;
    return data;
  } catch {
    return null;
  }
}

export function frameUrl(
  manifest: RobotFrameManifest,
  set: FrameSet,
  index: number,
): string {
  const base = manifest.basePath ?? "/frames/robot";
  const name = `frame_${String(index + 1).padStart(manifest.padding, "0")}.${manifest.ext}`;
  return `${base}/${set}/${name}`;
}

async function loadFrame(url: string): Promise<FrameAsset> {
  if (typeof createImageBitmap === "function") {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Missing frame: ${url}`);
    const blob = await res.blob();
    return await createImageBitmap(blob);
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Missing frame: ${url}`));
    img.src = url;
  });
}

/**
 * Progressive frame cache.
 *
 * Load order is: first frame (so the LCP is instant) → a coarse skeleton of
 * evenly spaced frames (the whole animation is at least roughly seekable) →
 * the remaining frames in small batches. `getFrame` snaps to the nearest
 * loaded frame, which also gives mobile half-density loading for free.
 */
export class FrameSequence {
  readonly manifest: RobotFrameManifest;
  readonly step: number;
  private readonly frames: (FrameAsset | null)[];
  private readonly indices: number[];
  private aborted = false;

  loaded = 0;
  toLoad = 0;
  ready = false;

  constructor(manifest: RobotFrameManifest, opts?: { step?: number }) {
    this.manifest = manifest;
    const naturalStep = Math.max(1, Math.round(opts?.step ?? 1));
    this.step = naturalStep;
    this.frames = new Array(manifest.count).fill(null);
    this.indices = [];
    for (let i = 0; i < manifest.count; i += this.step) this.indices.push(i);
    this.toLoad = this.indices.length;
  }

  private async fetchInto(index: number): Promise<void> {
    if (this.frames[index]) return;
    try {
      const asset = await loadFrame(
        frameUrl(this.manifest, this.set, index),
      );
      if (this.aborted) {
        if ("close" in asset) asset.close();
        return;
      }
      this.frames[index] = asset;
      this.loaded += 1;
      if (this.ready) return;
    } catch {
      // A single missing frame is not fatal: getFrame walks outward.
    }
  }

  set: FrameSet = "desktop";

  async load(
    onProgress: (loaded: number, total: number) => void,
    onFirstReady?: () => void,
  ): Promise<void> {
    const first = this.indices[0];
    try {
      await this.fetchInto(first);
    } catch {
      /* handled below */
    }
    if (!this.frames[first]) throw new Error("No frames available");
    onFirstReady?.();
    onProgress(this.loaded, this.toLoad);

    const stride = Math.max(1, Math.ceil(this.indices.length / 24));
    const coarse = this.indices.filter((_, i) => i % stride === 0);
    await this.runBatches(coarse, 6, onProgress);

    const rest = this.indices.filter((i) => this.frames[i] == null);
    await this.runBatches(rest, 8, onProgress);

    this.ready = true;
    onProgress(this.loaded, this.toLoad);
  }

  private async runBatches(
    list: number[],
    size: number,
    onProgress: (loaded: number, total: number) => void,
  ): Promise<void> {
    for (let i = 0; i < list.length; i += size) {
      if (this.aborted) return;
      const batch = list.slice(i, i + size);
      await Promise.all(batch.map((index) => this.fetchInto(index)));
      onProgress(this.loaded, this.toLoad);
      // Yield to the main thread so scrolling stays smooth while loading.
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  private snap(index: number): number {
    const clamped = Math.min(
      this.manifest.count - 1,
      Math.max(0, index),
    );
    return Math.round(clamped / this.step) * this.step;
  }

  /** Nearest already-loaded frame to `index`, or null if nothing is loaded. */
  getFrame(index: number): FrameAsset | null {
    const snapped = this.snap(index);
    if (this.frames[snapped]) return this.frames[snapped];
    for (
      let d = this.step, limit = 0;
      limit < this.manifest.count;
      d += this.step, limit += this.step
    ) {
      const below = snapped - d;
      const above = snapped + d;
      if (below >= 0 && this.frames[below]) return this.frames[below];
      if (above < this.manifest.count && this.frames[above])
        return this.frames[above];
    }
    for (let i = 0; i < this.manifest.count; i += this.step) {
      if (this.frames[i]) return this.frames[i];
    }
    return null;
  }

  dispose(): void {
    this.aborted = true;
    for (let i = 0; i < this.frames.length; i++) {
      const asset = this.frames[i];
      if (asset && "close" in asset) asset.close();
      this.frames[i] = null;
    }
  }
}
