declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  interface PdfTextItem {
    str: string;
    hasEOL?: boolean;
  }

  interface PdfTextContent {
    items: unknown[];
  }

  interface PdfPageProxy {
    getTextContent(): Promise<PdfTextContent>;
  }

  interface PdfDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PdfPageProxy>;
    cleanup(keepLoadedFonts?: boolean): Promise<unknown>;
  }

  interface PdfLoadingTask {
    promise: Promise<PdfDocumentProxy>;
    destroy(): Promise<void>;
  }

  interface GetDocumentParams {
    data: Uint8Array;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    disableFontFace?: boolean;
    standardFontDataUrl?: string;
    cMapUrl?: string;
    cMapPacked?: boolean;
    wasmUrl?: string;
  }

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(params: GetDocumentParams): PdfLoadingTask;
  export type { PdfTextItem };
}
