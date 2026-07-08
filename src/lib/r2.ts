import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(file: Buffer, filename: string, contentType: string): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME || '';
  const publicUrl = process.env.R2_PUBLIC_URL || '';

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !bucketName) {
    throw new Error('Cloudflare R2 environment variables are missing');
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: file,
      ContentType: contentType,
    })
  );

  const cleanUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
  return `${cleanUrl}/${filename}`;
}
