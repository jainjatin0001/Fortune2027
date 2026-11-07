"""Side-by-side review sheets for a batch: PDF page (left) | the JSON's HTML rendered (right).

usage: python rwreview.py <pdf> <batch.json> <out-dir>   -> <out-dir>/review-<page>.png
Look at every sheet: italics, bullets, paragraphs, options and the ✓ on the keyed answer must match.
"""
import io
import json
import re
import sys
from pathlib import Path

import pymupdf

CSS = """
* { font-family: sans-serif; font-size: 9px; line-height: 1.45; }
p { margin: 0 0 6px 0; }
ul { margin: 0 0 6px 0; padding-left: 18px; }
li p { margin: 0; }
blockquote { margin: 0 0 6px 0; padding-left: 24px; }
blockquote + blockquote { margin-top: 14px; }
table { border-collapse: collapse; margin: 0 auto 6px auto; }
th, td { border: 1px solid #555; padding: 2px 5px; text-align: center; }
h4 { font-weight: bold; margin: 8px 0 2px 0; }
"""
TOP = 95  # below the metadata table


def render_html(body, height, folder):
    """HTML -> one-page PDF document, 612pt wide (the PDF's text width), with the given height.
    <img src="fig-…png"> files are read from the batch folder; width/height attributes are CSS pixels (= 0.75pt)."""
    buf = io.BytesIO()
    writer = pymupdf.DocumentWriter(buf)
    rect = pymupdf.Rect(0, 0, 612, height)
    body = re.sub(r'<img ([^>]*)width="(\d+)" height="(\d+)"',
                  lambda m: f'<img {m.group(1)}width="{int(m.group(2)) * 3 // 4}" height="{int(m.group(3)) * 3 // 4}"', body)
    story = pymupdf.Story(html=body, user_css=CSS, archive=str(folder))
    dev = writer.begin_page(rect)
    more, _ = story.place(rect + (18, 6, -18, -6))
    story.draw(dev)
    writer.end_page()
    writer.close()
    return pymupdf.open('pdf', buf.getvalue()), more


def main():
    pdf, batch, outdir = pymupdf.open(sys.argv[1]), json.load(open(sys.argv[2])), Path(sys.argv[3])
    outdir.mkdir(parents=True, exist_ok=True)
    for q in batch['questions']:
        imgs = q['pageImage'] if isinstance(q['pageImage'], list) else [q['pageImage']]
        pnos = [int(re.search(r'\d+', p).group()) for p in imgs]
        # left column: first page below the metadata table, then each continuation page's text
        clips = []
        for i, n in enumerate(pnos):
            top = TOP if i == 0 else 0
            bottom = max(b[3] for b in pdf[n - 1].get_text('blocks')) + 8
            clips.append((n, pymupdf.Rect(0, top, 612, bottom)))
        left_h = sum(c.height for _, c in clips)
        opts = ''.join(
            f'<p>{"✓ " if o["isCorrect"] else ""}{"ABCD"[i]}. {re.sub(r"^<p>|</p>$", "", o["content"])}</p>'
            for i, o in enumerate(q['options']))
        body = (f'<h4>{q["externalId"]} · {q["skill"]} · {q["difficulty"]}</h4><h4>Question</h4>{q["statement"]}'
                f'<h4>Answer</h4>{opts}<h4>Correct Answer: {q["pdfCorrectAnswer"]}</h4>'
                f'<h4>Rationale</h4>{q["explanation"]}')
        height = left_h + 60
        mine, overflow = render_html(body, height, Path(sys.argv[2]).parent)
        if overflow:
            print(f'p{q["page"]}: rendered HTML is taller than the sheet (cut off)')
        sheet = pymupdf.open()
        sp = sheet.new_page(width=1224, height=height)
        y = 0
        for n, clip in clips:
            sp.show_pdf_page(pymupdf.Rect(0, y, 612, y + clip.height), pdf, n - 1, clip=clip)
            if y:
                sp.draw_line((0, y), (612, y), color=(0, 0, 0.8), width=0.5, dashes='[3] 0')
            y += clip.height
        sp.draw_line((612, 0), (612, height), color=(0.8, 0, 0), width=1)
        sp.show_pdf_page(pymupdf.Rect(612, 0, 1224, height), mine, 0)
        sp.get_pixmap(dpi=100).save(outdir / f'review-{q["page"]}.png')
    print(len(batch['questions']), 'sheets in', outdir)


if __name__ == '__main__':
    main()
