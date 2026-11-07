"""Renders every PDF page to <out>/page-N.png and prints a per-page outline to plan batches.

usage: python render.py <pdf> <out-dir> [first-page last-page]
Needs PyMuPDF (pip install pymupdf) — install it in a venv outside the project.
"""
import os
import re
import sys

import pymupdf

pdf, out = sys.argv[1], sys.argv[2]
doc = pymupdf.open(pdf)
first, last = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1, doc.page_count)
os.makedirs(out, exist_ok=True)

for pno in range(first, last + 1):
    page = doc[pno - 1]
    page.get_pixmap(dpi=110).save(f'{out}/page-{pno}.png')
    text = page.get_text()
    qid = re.search(r'Question ID:\s*(\w+)', text)
    vector_paths = len(page.get_drawings())
    print(f'page {pno:3}: {qid.group(1) if qid else "(continued)":10} drawings={vector_paths:4} images={len(page.get_images())}')
