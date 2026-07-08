'use client';

import { useState, useCallback } from 'react';

interface UploadResult {
  url: string;
}

interface UseEditorUploadReturn {
  uploading: boolean;
  uploadFile: (file: File) => Promise<string>;
}

/**
 * Provides a reusable upload function that POSTs to /api/admin/upload.
 * Tracks uploading state for UI feedback.
 */
export function useEditorUpload(): UseEditorUploadReturn {
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Upload failed');
      }
      const data: UploadResult = await res.json();
      return data.url;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, uploadFile };
}
