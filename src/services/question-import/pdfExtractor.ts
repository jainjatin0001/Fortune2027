import { join } from 'path';
import { pathToFileURL } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PdfTextItem } from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
  join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'),
).href;

const pdfjsAssetUrl = (directory: string) =>
  `${pathToFileURL(join(process.cwd(), 'node_modules/pdfjs-dist', directory)).href}/`;

export interface ExtractedPdfText {
  text: string;
  pages: number;
}

function isTextItem(item: unknown): item is PdfTextItem {
  return Boolean(item && typeof item === 'object' && 'str' in item);
}

export async function extractTextFromPdf(file: File): Promise<ExtractedPdfText> {
  if (file.type && file.type !== 'application/pdf') {
    throw new Error(`${file.name} is not a PDF.`);
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    standardFontDataUrl: pdfjsAssetUrl('standard_fonts'),
    cMapUrl: pdfjsAssetUrl('cmaps'),
    cMapPacked: true,
    wasmUrl: pdfjsAssetUrl('wasm'),
  });
  try {
    const document = await loadingTask.promise;
    const pageCount = document.numPages;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = content.items
        .filter(isTextItem)
        .map((item) => item.str + (item.hasEOL ? '\n' : ' '))
        .join('')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      if (text) pages.push(`--- Page ${pageNumber} ---\n${text}`);
    }

    const text = pages.join('\n\n').trim();
    if (!text) {
      throw new Error(`${file.name} has no searchable text. OCR is not supported in phase 1.`);
    }

    return { text, pages: pageCount };
  } finally {
    await loadingTask.destroy();
  }
}
