import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Uploads a file buffer to Cloudflare R2 and returns the public URL.
 * 
 * @param file The file data as a Buffer
 * @param filename The desired filename in the bucket
 * @param contentType The MIME type of the file
 * @param metadata Optional custom metadata stored on the object (x-amz-meta-*)
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  file: Buffer,
  filename: string,
  contentType: string,
  metadata?: Record<string, string>,
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME || '';
  const publicUrl = process.env.R2_PUBLIC_URL || '';

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !bucketName) {
    throw new Error('Cloudflare R2 environment variables are missing');
  }
  // The returned URL is stored in question HTML, so a malformed value would break every image silently
  if (!/^https?:\/\//.test(publicUrl)) {
    throw new Error('Cloudflare R2 environment variables are missing or invalid (R2_PUBLIC_URL must start with http)');
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: file,
      ContentType: contentType,
      // Keys are unique per upload and never overwritten, so browsers/CDN may cache forever
      CacheControl: 'public, max-age=31536000, immutable',
      Metadata: metadata,
    })
  );

  const cleanUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  return `${cleanUrl}/${filename}`;
}

/** Deletes objects by key (up to 1000 per call). */
export async function deleteFromR2(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await r2Client.send(
    new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME || '',
      Delete: { Objects: keys.map(Key => ({ Key })), Quiet: true },
    })
  );
}
