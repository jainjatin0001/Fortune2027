# PDF → question bank import

Turns College Board SAT question-bank PDF exports into a batch folder that the admin page
**/admin/questions/import** loads, reviews and saves. Extraction is done by Claude Code in a session
(no API key). The JSON format is the contract — see `ImportQuestion` in `src/lib/question-import.ts`.

```
imports/<batch>/            (gitignored)
  <batch>.json              questions (statement / options / answers / explanation as stored HTML)
  page-N.png                rendered PDF pages — review only, never uploaded
  fig-pN.png                cropped figures — uploaded to R2 by the import API on Save
  build.py                  the batch builder that produced the JSON
```

## Steps (one batch ≈ 30–40 questions per session)

1. **PyMuPDF** in a venv outside the project (scratchpad):
   `python3 -m venv <scratch>/venv && <scratch>/venv/bin/pip install pymupdf`
2. **Render + outline** (pick the page range for this batch; never split a question across batches):
   `<venv>/bin/python scripts/question-import/render.py <pdf> imports/<batch> [first last]`
   The outline shows each page's Question ID ("(continued)" = second page of the previous question).
   Drawing counts are not a reliable figure signal (math is often drawn as vectors) — look at the page images.
3. **Read every page image** and transcribe into `imports/<batch>/build.py`
   (copy `examples/sat-algebra-2026-10-31.py` and replace the `b.q(...)` calls).
4. **Crop figures**, view each crop, adjust until nothing is clipped:
   `<venv>/bin/python scripts/question-import/crop.py <pdf> imports/<batch> 2:176,160,434,412`
   Some graphs draw the minus sign as glyph code 0, which renders as nothing ("4" instead of "−4");
   crop.py redraws those and prints how many — always compare negative tick labels with the question.
5. **Build + check**:
   `python3 imports/<batch>/build.py imports/<batch>/<batch>.json`
   `node scripts/question-import/check.mjs imports/<batch>/<batch>.json` → must report 0 KaTeX errors.
   `<venv>/bin/python scripts/question-import/textdiff.py <pdf> imports/<batch>/<batch>.json` → every
   remaining difference must be explainable (plain-text math now LaTeX, graph labels); fix anything else.
6. Copy the folder to `~/Desktop/` for the admin to pick with **Choose batch folder**.

## The 586-question Algebra export (questionbank-export-2026-11-1.pdf, 617 pages)

Batches of 30, folders `imports/algebra-batch-NN` (and `~/Desktop/algebra-batch-NN`):

| batch | pages | batch | pages | batch | pages | batch | pages |
|---|---|---|---|---|---|---|---|
| 01 | 1–31 | 06 | 158–189 | 11 | 314–343 | 16 | 470–503 |
| 02 | 32–62 | 07 | 190–220 | 12 | 344–375 | 17 | 504–533 |
| 03 | 63–93 | 08 | 221–251 | 13 | 376–406 | 18 | 534–565 |
| 04 | 94–124 | 09 | 252–282 | 14 | 407–439 | 19 | 566–600 |
| 05 | 125–157 | 10 | 283–313 | 15 | 440–469 | 20 | 601–617 (16 q) |

## The 540-question Advanced Math export (questionbank-export-2026-11-6.pdf, 565 pages)

Skills: Nonlinear functions 259, Nonlinear equations in one variable and systems of equations in two
variables 165, Equivalent expressions 116. 121 NUMERIC (no A–D options). 25 continuation pages. Transcribed
like Algebra (math → LaTeX from the page images; check.mjs + textdiff; view every figure crop). Batches of 30,
folders `imports/advmath-batch-NN`:

| batch | pages | batch | pages | batch | pages |
|---|---|---|---|---|---|
| 01 | 1–33 | 07 | 188–221 | 13 | 379–408 |
| 02 | 34–64 | 08 | 222–252 | 14 | 409–439 |
| 03 | 65–94 | 09 | 253–283 | 15 | 440–470 |
| 04 | 95–126 | 10 | 284–316 | 16 | 471–503 |
| 05 | 127–157 | 11 | 317–347 | 17 | 504–534 |
| 06 | 158–187 | 12 | 348–378 | 18 | 535–565 |

## The 348-question Geometry and Trigonometry export (questionbank-export-2026-11-6.pdf, 360 pages)

Downloaded 2026-11-06 21:19 under the same file name as Advanced Math, which it replaced. Skills: Area and volume
110, Lines, angles, and triangles 102, Right triangles and trigonometry 69, Circles 67. About 103 NUMERIC.
Continuation pages: 13, 44, 96, 100, 104, 143, 253, 257, 268, 290, 302, 345. Transcribed like Advanced Math, but
most questions have a diagram. Batches of 30, folders `imports/geometry-batch-NN`:

| batch | pages | batch | pages | batch | pages |
|---|---|---|---|---|---|
| 01 | 1–31 | 05 | 126–156 | 09 | 247–279 |
| 02 | 32–62 | 06 | 157–186 | 10 | 280–311 |
| 03 | 63–92 | 07 | 187–216 | 11 | 312–341 |
| 04 | 93–125 | 08 | 217–246 | 12 | 342–360 (18 q) |

Geometry notation (KaTeX): `\angle ABC`, `\overline{AB}`, `\overset{\frown}{AB}` for arcs, `\triangle ABC`,
`\parallel`, `\perp`, `\cong`, `\sim`, `40^\circ`, `\pi`, `\sin x`, `\cos(x^\circ)`, `\sqrt{3}`. Write the notation
the PDF uses (an overline bar or arc mark is part of the notation). Diagrams: crop every one, view each crop, and
compare every label with the question: vertex letters, lengths, angle marks, degree signs, √ and π, right-angle
boxes, tick marks, and missing minus signs. Alt text must describe the given labels without stating any value the
question asks for. Reviewers also check the labels inside each figure crop.

## The 421-question Problem-Solving and Data Analysis export (questionbank-export-2026-11-7.pdf, 456 pages)

Downloaded 2026-11-07 12:11. Skills: Ratios, rates, proportional relationships, and units 93; Percentages 84;
One-variable data: Distributions and measures of center and spread 84; Two-variable data: Models and scatterplots 71;
Probability and conditional probability 49; Inference from sample statistics and margin of error 28; Evaluating
statistical claims: Observational studies and experiments 12. About 102 NUMERIC. The text layer splits
"propor tional" (Type3 kerning) — write the skill as "proportional". Continuation pages: 20, 28, 38, 49, 64–66
(one question on 63–66), 77, 85, 89, 91, 105, 126, 138, 141, 152, 178, 189, 210, 241, 248*, 259, 289*, 298, 308*,
315, 319, 342, 351, 359, 363, 426, 437, 449, 451 (* = blank → use only the real page). Data tables are common
(→ `table(...)`, never images); scatterplots, histograms, dot plots and box plots are figures. Transcribed like
Geometry. Batches of 30, folders `imports/psda-batch-NN`:

| batch | pages | batch | pages | batch | pages |
|---|---|---|---|---|---|
| 01 | 1–32 | 06 | 167–198 | 11 | 328–360 |
| 02 | 33–67 | 07 | 199–229 | 12 | 361–391 |
| 03 | 68–101 | 08 | 230–262 | 13 | 392–421 |
| 04 | 102–133 | 09 | 263–293 | 14 | 422–456 (31 q) |
| 05 | 134–166 | 10 | 294–327 | | |

## Reading & Writing (English) exports — parsed, not transcribed

English has no math, so `rwparse.py` builds the questions straight from the PDF text layer (italics → `<em>`,
bullet notes → `<ul>`, sub/superscripts, paragraphs; each "Choice X is incorrect" gets its own paragraph).
Each page is one question. Per batch:

1. `<venv>/bin/python scripts/question-import/rwparse.py <pdf> [first last]` — lists pages the parser flags
   (anything but the standard layout). Each needs an entry in the batch's `OVERRIDES` (with a `note`).
2. Copy `imports/english-batch-01/build.py`, set `FIRST, LAST` and `OVERRIDES`; render pages with `render.py`.
3. Build + `check.mjs` + `textdiff.py` as above (textdiff ignores whitespace, so it can't catch spacing).
4. `<venv>/bin/python scripts/question-import/rwreview.py <pdf> <batch.json> <scratch>/review` → one
   side-by-side sheet per question (PDF | rendered JSON). **Look at every sheet**: italics, bullets,
   paragraphs, options, ✓ on the key.

The 398-question R&W export (questionbank-export-2026-11-1.pdf, downloaded 2026-11-01 16:08 — same file
name as the Algebra one, which it replaced): Transitions 194, Rhetorical Synthesis 204. Batches of 50,
`imports/english-batch-NN`: 01 = 1–50, 02 = 51–100, … 08 = 351–398. Known pages: p19 option D printed as a
nested bullet (override in batch 01); p241 rationale has a stray " ." after “therefore.” (fix in batch 05).

The 421-question Standard English Conventions export (questionbank-export-2026-11-3.pdf): Boundaries 213,
Form, Structure, and Sense 208. Batches of 50, `imports/conventions-batch-NN`: 01 = 1–50 … 08 = 351–400,
09 = 401–421 (21). Overrides: p313 "( “journey”)" space (batch 07); p385 ʻokina missing from the PDF (NUL)
→ U+02BB (batch 08). This export needed a second italic anchor (FACE_ITALIC) — a new export may too; the
parser stops with "fonts not recognised" when that happens.

The 471-question Craft and Structure export (questionbank-export-2026-11-4.pdf, 499 pages): Words in Context
261, Text Structure and Purpose 149, Cross-Text Connections 61. 28 questions run onto a second page, so batch
ranges are by question: `imports/craft-batch-NN`, 01 = 1–51, 02 = 52–102, 03 = 103–159, 04 = 160–211,
05 = 212–264, 06 = 265–317, 07 = 318–369, 08 = 370–422, 09 = 423–474, 10 = 475–499 (21 q). New layouts
rwparse handles: underlines (<u>), continuation pages, indented passages (<blockquote>; stanza/speaker breaks
= a new blockquote), poem lines (<br> / deeper indent as nbsp), © credits right-aligned, "Text 1/2" bold.
Overrides: p379 page break checked; p450 "Hagar" italics.

The 555-question Information and Ideas export (also saved as questionbank-export-2026-11-4.pdf, 15:58 —
replaced the Craft file; 659 pages): Command of Evidence 277, Inferences 140, Central Ideas and Details 138.
`imports/info-batch-NN`: 01 = 1–58, 02 = 59–118, 03 = 119–177, 04 = 178–236, 05 = 237–295, 06 = 296–356,
07 = 357–412, 08 = 413–474, 09 = 475–539, 10 = 540–598, 11 = 599–659 (55 q). New in rwparse: graphs (labels in
a real font, not Type3) are cropped to fig-pN.png at 192 dpi and placed as <img> (uploaded to R2 on Save);
data tables (black rule grids) become <table> with colspan; centred titles; bold-italic face; a closing quote
printed as “ is corrected. Overrides: p393 page break checked; p94 italic typo.

Review agents for these exports: one per batch, told to check options character by character and to use the
JSON for exact characters. Verify every reported issue against the PDF text layer before fixing; fix it in
rwparse.py when it's systematic (ellipsis/en-dash line joins, superscript line gaps, combining accents and
soft hyphens were all found this way), with an override only for one-off PDF defects.

## Transcription rules

- Each question: `Question ID`, metadata table (Skill, Difficulty), Question, optional Answer A–D,
  `Correct Answer:`, Rationale. A question may continue on the next page → `pages=[n, n+1]`.
- **Type**: A–D options → `SINGLE_CORRECT` (`correct='C'`); no options → `NUMERIC`
  (`answers=` every form in "Correct Answer", plus forms the rationale lists as valid entries;
  the grader compares by value but does not round, so list each decimal form).
- `pdf=` the raw "Correct Answer" line; `None` when the PDF has none (the page flags it).
- **All math is LaTeX** (`\( \)` / `\[ \]`), never images — including math that is drawn as vectors
  (missing from the text layer), raster equation pictures, and broken text (superscripts on their own lines).
  Read math from the page image, not the text layer. Money in math: `\$35`; thousands: `1{,}000`.
- **Only real figures** (graphs, diagrams) become images: `figure('fig-p2.png', alt, w, h)` with
  w/h = crop pixels / 2. Tables become `table(header, rows)`.
- Explanation = the full Rationale, including every "Choice X is incorrect…" paragraph, one paragraph each.
- Skill → `skill` (saved as a tag). Subject, topic, source type, tags, points come from the batch form.

## Saving

The admin picks the folder, reviews (flags: validation error, answer-key check, has figure), then
**Save N approved** → `POST /api/admin/questions/import`: validates everything first, uploads used figures
to R2 under `question-imports/<date>-<id>/`, creates all questions in one transaction, and deletes the
uploaded figures again if the transaction fails. The server needs the `R2_*` env vars.
