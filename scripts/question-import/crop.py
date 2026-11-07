"""Crops figures (graphs, diagrams) from PDF pages at 192 dpi.

usage: python crop.py <pdf> <out-dir> <page>:<x0>,<y0>,<x1>,<y1> [...]
Boxes are in PDF points (page is 612x792). Rendered page-N.png is 110 dpi, so
points = png_pixels * 72 / 110. Always view the crop and adjust until no label is clipped.
Output: fig-p<page>.png (a second figure on the same page: add a suffix by hand).
Use width/height = crop pixels / 2 in the <img>.

Some graphs label negative ticks with a minus glyph whose character code is 0; MuPDF draws
nothing for it (the page renders show "4" where the PDF means "−4"). Those glyphs are redrawn
as a short line before cropping — the count is printed; check the crop against the question.
"""
import sys

import pymupdf


def redraw_missing_minus(page, clip):
    fixed = 0
    for block in page.get_text('rawdict', clip=clip)['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                for ch in span['chars']:
                    if ch['c'] != '\x00':
                        continue
                    x0, y0, x1, y1 = ch['bbox']
                    # A minus sits at the digits' x-height middle, a bit below the bbox centre
                    y = y0 + (y1 - y0) * 0.55
                    w = x1 - x0
                    page.draw_line((x0 + w * 0.12, y), (x1 - w * 0.12, y), color=(0, 0, 0), width=span['size'] * 0.07)
                    fixed += 1
    return fixed


doc = pymupdf.open(sys.argv[1])
out = sys.argv[2]
for spec in sys.argv[3:]:
    page_no, box = spec.split(':')
    page = doc[int(page_no) - 1]
    rect = pymupdf.Rect(*map(float, box.split(',')))
    fixed = redraw_missing_minus(page, rect)
    pix = page.get_pixmap(dpi=192, clip=rect)
    path = f'{out}/fig-p{page_no}.png'
    pix.save(path)
    note = f'  (redrew {fixed} minus sign(s))' if fixed else ''
    print(path, f'{pix.width}x{pix.height}', f'-> width="{round(pix.width / 2)}" height="{round(pix.height / 2)}"' + note)
