import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { connectDB } from './mongodb';

const BUCKET_NAME = 'productImages';

async function getBucket(): Promise<GridFSBucket> {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection not ready');
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

/**
 * Upload a single image buffer to GridFS, plus an auto-generated thumbnail.
 * Returns the ObjectIds needed to store on the Product document.
 */
export async function uploadImageToGridFS(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ fileId: ObjectId; thumbFileId: ObjectId }> {
  const bucket = await getBucket();

  // Compress the original (cap width at 1600px, convert to webp for a good size/quality ratio)
  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  // Generate a small thumbnail for grids/quick-view
  const thumbnail = await sharp(buffer)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  const fileId = await writeBufferToBucket(bucket, optimized, `${filename}.webp`, 'image/webp');
  const thumbFileId = await writeBufferToBucket(
    bucket,
    thumbnail,
    `${filename}-thumb.webp`,
    'image/webp'
  );

  return { fileId, thumbFileId };
}

function writeBufferToBucket(
  bucket: GridFSBucket,
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<ObjectId> {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(uploadStream.id as ObjectId));
    uploadStream.on('error', reject);
  });
}

/** Stream a stored image back out (used by app/api/images/[id]/route.ts). */
export async function readImageFromGridFS(id: string) {
  const bucket = await getBucket();
  const _id = new ObjectId(id);

  const files = await bucket.find({ _id }).toArray();
  if (!files.length) return null;

  const file = files[0];
  const stream = bucket.openDownloadStream(_id);
  return { stream, contentType: file.contentType || 'image/webp', filename: file.filename };
}

export async function deleteImageFromGridFS(id: string) {
  const bucket = await getBucket();
  await bucket.delete(new ObjectId(id));
}
