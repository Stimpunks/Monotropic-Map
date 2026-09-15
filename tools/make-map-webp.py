#!/usr/bin/env python3
"""make-map-webp.py — the two maps as WebP, derived from the PNGs, pixel for pixel.

THE ARTWORK IS NEVER ALTERED. That is the rule in ATTRIBUTIONS.md, and it is why this
encodes LOSSLESS WebP and then decodes the result back and compares it to the source
pixel by pixel before writing anything. A "lossless" flag is a promise from an encoder;
the comparison is evidence. If a single pixel differs, nothing is written.

The PNGs stay in the repository and stay the fallback in the <picture> chain. They are
the originals Helen published, they are what somebody re-using the map under CC BY-SA
should be able to download, and WebP is a delivery format rather than a replacement.

    python3 tools/make-map-webp.py           encode, verifying every pixel
    python3 tools/make-map-webp.py --check   verify what is committed, write nothing

Needs Pillow, so a regeneration needs it installed. `--check` says plainly when it could
not run rather than reporting a pass it did not earn — the slides tool does the same.
"""
import sys, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAPS = ['map-of-monotropic-experiences', 'map-of-neuronormative-domination']

try:
    from PIL import Image
except ImportError:
    print('make-map-webp: Pillow is not installed — cannot encode or verify', file=sys.stderr)
    sys.exit(2)


def pixels(path):
    """Decoded RGBA bytes. Comparing these, not the file, is the whole point: the two
       files are different formats and will never be byte-identical."""
    with Image.open(path) as im:
        return im.convert('RGBA').tobytes(), im.size


def main():
    check = '--check' in sys.argv
    problems, report = [], []

    for slug in MAPS:
        png = ROOT / 'images' / f'{slug}.png'
        webp = ROOT / 'images' / f'{slug}.webp'
        if not png.exists():
            problems.append(f'{png.name} is missing')
            continue

        src, size = pixels(png)

        if not check:
            with Image.open(png) as im:
                im.save(webp, 'WEBP', lossless=True, method=6, exact=True)

        if not webp.exists():
            problems.append(f'{webp.name} has not been generated — run tools/make-map-webp.py')
            continue

        out, out_size = pixels(webp)
        if out_size != size:
            problems.append(f'{webp.name} is {out_size[0]}x{out_size[1]}, the PNG is {size[0]}x{size[1]}')
        elif out != src:
            differing = sum(1 for a, b in zip(src, out) if a != b)
            problems.append(f'{webp.name} does not decode to the same pixels as the PNG ({differing} bytes differ)')
            if not check:
                webp.unlink()  # never leave an altered copy of somebody else's artwork on disk
        else:
            report.append(f'{webp.name} {webp.stat().st_size:,}B vs PNG {png.stat().st_size:,}B, pixels identical')

    if problems:
        print('make-map-webp: FAIL')
        for p in problems:
            print(f'  {p}')
        sys.exit(1)

    print('make-map-webp --check: ' if check else 'make-map-webp: ' + '')
    for r in report:
        print(f'  {r}')


if __name__ == '__main__':
    main()
