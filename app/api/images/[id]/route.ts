import { NextRequest, NextResponse } from 'next/server';
import { readImageFromGridFS } from '@/lib/gridfs';
import { Readable } from 'stream';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await readImageFromGridFS(id);
    if (!result) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const { stream, contentType } = result;

    // Convert the Node GridFS download stream into a Web ReadableStream for the Response.
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Image fetch error:', err);
    return NextResponse.json({ error: 'Invalid image id' }, { status: 400 });
  }
}
