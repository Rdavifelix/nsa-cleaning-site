#!/usr/bin/env python3
"""Generate optimized WebP renditions from raw-images/ using raw-images/manifest.json.

manifest.json format:
{
  "images": [
    {"src": "WhatsApp Image 2026-09-12 at 6.59.19 PM.jpeg", "slug": "logo-nsa-cleaning", "alt": "...",
     "widths": [480, 800, 1200], "quality": 82, "crop": [x0, y0, x1, y1] (optional), "category": "deck"}
  ]
}
Outputs public/images/<slug>-<width>.webp (never upscales; the largest requested width ≤ source width, plus
the source width itself if smaller than the largest requested) and prints a summary.
"""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw-images')
OUT = os.path.join(ROOT, 'public', 'images')
manifest_path = os.path.join(RAW, 'manifest.json')
m = json.load(open(manifest_path))
total = 0
for item in m['images']:
    src = os.path.join(RAW, item['src'])
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    if item.get('crop'):
        im = im.crop(tuple(item['crop']))
    q = item.get('quality', 80)
    widths = sorted(set(w for w in item.get('widths', [480, 800, 1200]) if w <= im.width))
    if not widths or max(widths) < im.width and im.width <= max(item.get('widths', [1200])):
        widths.append(im.width)
    generated = []
    for w in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        out = os.path.join(OUT, f"{item['slug']}-{w}.webp")
        r.save(out, 'WEBP', quality=q, method=6)
        sz = os.path.getsize(out); total += sz
        generated.append({'width': w, 'height': h, 'file': f"/images/{item['slug']}-{w}.webp", 'bytes': sz})
    item['generated'] = generated
    item['aspect'] = round(im.width / im.height, 4)
    print(f"{item['slug']:34s} {im.width}x{im.height} → " + ', '.join(f"{g['width']}w {g['bytes']//1024}KB" for g in generated))
json.dump(m, open(manifest_path, 'w'), indent=2)
print(f"\nTotal generated: {total/1024:.0f} KB across {sum(len(i['generated']) for i in m['images'])} files")
