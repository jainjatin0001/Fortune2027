import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

const ALLOWED = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'csv', 'mp4', 'webm', 'ogg', 'mov'];
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

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
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large (max 100 MB)' }, { status: 400 });

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json({ error: `File type .${ext} not allowed. Supported formats: ${ALLOWED.join(', ')}` }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Determine content type (fallback to general binary stream if not set)
    const contentType = file.type || 'application/octet-stream';

    const url = await uploadToR2(fileBuffer, filename, contentType);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

