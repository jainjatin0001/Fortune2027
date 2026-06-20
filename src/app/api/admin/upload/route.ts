import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, or GIF allowed' }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ url: `/uploads/blog/${filename}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
