#!/usr/bin/env python3
"""make-slides.py — render the sixteen training slides out of the source PDF.

THE SOURCE PDF IS NOT IN THIS REPOSITORY. It is 62 MB and Autistic Realms publishes
it; this tool fetches it to a temporary file. So a regeneration needs the network and
`pdftoppm` (poppler) and Pillow. **A tool that could not run has not run** — each
missing piece is named, with the command to fix it, and the exit status says so.

The slide is a fixed 16:9 region of the Canva page template, measured once and
verified across pages 1, 3, 5, 12, 14 and 26 on 2026-09-15. It is NOT detected per
page: ink-density detection was tried first and bled into the presenter notes, which
is worse than a constant because it fails differently on every page.

    python3 tools/make-slides.py           render every slide
    python3 tools/make-slides.py --check   report drift, write nothing
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "slides"
MANIFEST = OUT / "manifest.json"

DPI = 150
# x0, y0, x1 of the slide on a 150-dpi A4 page; the height is x-width * 9/16.
BOX_X0, BOX_Y0, BOX_X1 = 75, 76, 1165
WIDTH = 1400  # delivered width; the source renders wider than we need at 150 dpi


def die(msg, fix=None):
    print(f"make-slides: {msg}", file=sys.stderr)
    if fix:
        print(f"  fix: {fix}", file=sys.stderr)
    sys.exit(2)


def read_slides():
    """Parse tools/slides.mjs for page/slug. One source of truth, and no JS runtime
    needed here — but if the shapes ever disagree, say so instead of guessing."""
    src = (ROOT / "tools" / "slides.mjs").read_text(encoding="utf-8")
    out = []
    import re
    for m in re.finditer(r"\{\s*page:\s*(\d+),\s*slug:\s*'([^']+)'", src):
        out.append((int(m.group(1)), m.group(2)))
    if not out:
        die("could not read any slides out of tools/slides.mjs")
    return out


def main():
    check = "--check" in sys.argv
    slides = read_slides()

    if check:
        if not MANIFEST.exists():
            print(f"make-slides --check: no manifest; {len(slides)} slides have never been rendered")
            sys.exit(1)
        man = json.loads(MANIFEST.read_text())
        missing = [s for _, s in slides if s not in man]
        orphan = [s for s in man if s not in {sl for _, sl in slides}]
        gone = [s for _, s in slides if s in man and not (OUT / f"{s}.webp").exists()]
        problems = []
        if missing:
            problems.append(f"{len(missing)} slide(s) in slides.mjs with no image: {', '.join(missing)}")
        if orphan:
            problems.append(f"{len(orphan)} image(s) with no entry in slides.mjs: {', '.join(orphan)}")
        if gone:
            problems.append(f"{len(gone)} manifest entr(ies) whose file is missing: {', '.join(gone)}")
        for p in problems:
            print(f"  FAIL  {p}")
        if not problems:
            print(f"make-slides --check: {len(slides)} slides present and listed")
        sys.exit(1 if problems else 0)

    if not shutil.which("pdftoppm"):
        die("pdftoppm not found", "brew install poppler")
    try:
        from PIL import Image
    except ImportError:
        die("Pillow not installed", "pip3 install Pillow")

    sys.path.insert(0, str(ROOT / "tools"))
    pdf_url = None
    for line in (ROOT / "tools" / "slides.mjs").read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("'https://") and ".pdf" in line:
            pdf_url = line.strip().strip("';")
            break
    if not pdf_url:
        die("could not find SLIDE_PDF in tools/slides.mjs")

    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        pdf = tmp / "training.pdf"
        print(f"fetching {pdf_url}")
        try:
            req = urllib.request.Request(pdf_url, headers={"User-Agent": "Mozilla/5.0 (monotropicmap.org)"})
            with urllib.request.urlopen(req, timeout=120) as r, open(pdf, "wb") as f:
                shutil.copyfileobj(r, f)
        except Exception as e:
            die(f"could not fetch the source PDF: {e}", "check the network, or the URL in tools/slides.mjs")
        print(f"  {pdf.stat().st_size / 1e6:.0f} MB")

        manifest = {}
        for page, slug in slides:
            subprocess.run(
                ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(DPI), "-png", str(pdf), str(tmp / "pg")],
                check=True, capture_output=True,
            )
            rendered = sorted(tmp.glob("pg-*.png"))
            if not rendered:
                die(f"pdftoppm produced nothing for page {page}")
            im = Image.open(rendered[-1]).convert("RGB")
            h = round((BOX_X1 - BOX_X0) * 9 / 16)
            crop = im.crop((BOX_X0, BOX_Y0, BOX_X1, BOX_Y0 + h))
            crop = crop.resize((WIDTH, round(WIDTH * 9 / 16)), Image.LANCZOS)
            dest = OUT / f"{slug}.webp"
            crop.save(dest, "WEBP", quality=82, method=6)
            manifest[slug] = {"page": page, "width": crop.width, "height": crop.height,
                              "bytes": dest.stat().st_size}
            print(f"  p{page:>2}  {slug:<24} {dest.stat().st_size / 1024:>6.0f} KB")
            for f in rendered:
                f.unlink()

    MANIFEST.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    total = sum(v["bytes"] for v in manifest.values())
    print(f"make-slides: {len(manifest)} slides, {total / 1e6:.1f} MB total")


if __name__ == "__main__":
    main()
