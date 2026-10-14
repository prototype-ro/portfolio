#!/usr/bin/env python3
"""Video -> WebP frame sequence for the background robot.

Usage:
    python3 scripts/bake-frames.py <video.mp4> [--fps 24] [--quality 80]
                                        [--background "#e4e3df"]

Writes public/frames/robot/{desktop,mobile}/frame_%04d.webp.

Each frame's background is *flat-field corrected*: a low-frequency estimate of
the studio backdrop is divided out so the gradient/vignette collapses to a
single flat color. By default that color is sampled from the video's own
border (median), so the site background can match the clip exactly. Prints the
chosen color so you can put it in manifest.json as `"background"`.
"""
import argparse
import glob
import os
import shutil
import subprocess
import tempfile

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETS = ("desktop", "mobile")


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def rgb_to_hex(rgb) -> str:
    return "#" + "".join(f"{int(round(c)):02x}" for c in rgb)


def fit_background(arr: np.ndarray) -> np.ndarray:
    """Fit a smooth quadratic backdrop model from the light border pixels.

    Only border pixels are used (and only bright ones, to ignore antennas and
    the floor shadow), so the subject never pollutes the estimate — no halos.
    """
    h, w, _ = arr.shape
    ys, xs = np.mgrid[0:h, 0:w]
    lum = arr.mean(axis=2)
    border = (ys < h * 0.10) | (xs < w * 0.08) | (xs > w * 0.92)
    mask = border & (lum > 165)

    x = (xs[mask] / w).astype(np.float64)
    y = (ys[mask] / h).astype(np.float64)
    basis = np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], axis=1)

    xf = (xs / w).astype(np.float64)
    yf = (ys / h).astype(np.float64)
    full = np.stack([np.ones_like(xf), xf, yf, xf * xf, xf * yf, yf * yf], axis=-1)

    channels = []
    for c in range(3):
        coef, *_ = np.linalg.lstsq(basis, arr[..., c][mask].astype(np.float64), rcond=None)
        channels.append(full @ coef)
    return np.stack(channels, axis=-1).astype(np.float32)


def flatten(im: Image.Image, target: np.ndarray, bg: np.ndarray) -> Image.Image:
    arr = np.asarray(im, dtype=np.float32)
    gain = target / np.maximum(bg, 1.0)
    gain = np.clip(gain, 0.5, 2.0)
    out = np.clip(arr * gain, 0, 255).astype(np.uint8)
    return Image.fromarray(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--quality", type=int, default=80)
    ap.add_argument("--background", default=None, help="flat background hex")
    args = ap.parse_args()

    tmp = tempfile.mkdtemp(prefix="bake-frames-")
    try:
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", args.video,
             "-vf", f"fps={args.fps}", "-start_number", "1",
             os.path.join(tmp, "frame_%04d.png")],
            check=True,
        )
        files = sorted(glob.glob(os.path.join(tmp, "*.png")))

        first = Image.open(files[0]).convert("RGB")
        first_bg = fit_background(np.asarray(first, dtype=np.float32))
        if args.background:
            target_rgb = hex_to_rgb(args.background)
        else:
            med = np.median(first_bg.reshape(-1, 3), axis=0)
            target_rgb = tuple(int(round(v)) for v in med)
        target = np.array(target_rgb, dtype=np.float32)
        print(f"background: {rgb_to_hex(target_rgb)}")

        for set_name in SETS:
            out = os.path.join(ROOT, "public", "frames", "robot", set_name)
            os.makedirs(out, exist_ok=True)
            for old in glob.glob(os.path.join(out, "*.webp")):
                os.remove(old)

        for path in files:
            name = os.path.basename(path).replace(".png", ".webp")
            frame = Image.open(path).convert("RGB")
            bg = fit_background(np.asarray(frame, dtype=np.float32))
            flat = flatten(frame, target, bg)
            for set_name in SETS:
                flat.save(
                    os.path.join(ROOT, "public", "frames", "robot", set_name, name),
                    "WEBP", quality=args.quality, method=6,
                )
        print(f"frames: {len(files)} -> desktop/ + mobile/")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
