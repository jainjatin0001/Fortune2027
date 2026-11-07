"""Compares the non-math text of a batch JSON with the PDF text layer, per question.

usage: python textdiff.py <pdf> <batch.json>
Reports text that is in one but not the other (ignoring whitespace and case). Expected noise:
math written as plain text in older questions (now LaTeX), and the "Note that ... examples" line.
Anything else — a dropped sentence, a typo, a wrong word — must be fixed.
"""
import difflib
import html
import json
import re
import sys

import pymupdf

doc = pymupdf.open(sys.argv[1])
data = json.load(open(sys.argv[2]))


def norm(s):
    return re.sub(r'\s+', '', s.replace('\x00', '').replace('’', "'").replace('–', '-').replace('−', '-')).lower()


def html_text(h):
    h = re.sub(r'<span data-type="math-inline"[^>]*></span>|<div data-type="math-block"[^>]*></div>', ' ', h)
    h = re.sub(r'<img[^>]*>|<table>.*?</table>', ' ', h)
    return html.unescape(re.sub(r'<[^>]+>', ' ', h))


issues = 0
for q in data['questions']:
    pages = q['pageImage'] if isinstance(q['pageImage'], list) else [q['pageImage']]
    raw = ''.join(doc[int(re.search(r'\d+', p).group()) - 1].get_text() for p in pages)
    body = raw.split('\nQuestion\n', 1)[-1]
    body = re.sub(r'^(Answer|Rationale|Correct Answer:.*)$|^[A-D]\. ', '', body, flags=re.M)
    # Math the JSON holds as LaTeX: drop it from the PDF side too ($ amounts, xy-plane, plain-text equations)
    body = re.sub(r'\$[\d,.]+|\bxy\b', ' ', body)
    pdf = norm(body)
    mine = norm(' '.join([html_text(q['statement'])] + [html_text(o['content']) for o in q['options']] + [html_text(q['explanation'])]))
    sm = difflib.SequenceMatcher(None, pdf, mine, autojunk=False)
    diffs = [(t, pdf[a:b], mine[c:d]) for t, a, b, c, d in sm.get_opcodes() if t != 'equal' and max(b - a, d - c) >= 2]
    if diffs:
        print(f"--- {q['externalId']} (p{q['page']})")
        for t, a, b in diffs:
            print(f'   {t:7} pdf={a[:70]!r} json={b[:70]!r}')
        issues += len(diffs)
print('differences:', issues)
