import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImageToGridFS } from '@/lib/gridfs';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const uploaded = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `${file.name} exceeds the 8MB limit` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-_]/gi, '-');

    const { fileId, thumbFileId } = await uploadImageToGridFS(buffer, safeName, file.type);

    uploaded.push({
      fileId: fileId.toString(),
      thumbFileId: thumbFileId.toString(),
      url: `/api/images/${fileId.toString()}`,
      thumbUrl: `/api/images/${thumbFileId.toString()}`,
    });
  }

  return NextResponse.json({ uploaded });
}

export const config = {
  api: { bodyParser: false },
};
