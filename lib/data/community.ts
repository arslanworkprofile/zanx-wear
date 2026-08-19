import { connectDB } from '@/lib/mongodb';
import CommunityPost from '@/models/CommunityPost';

export interface CommunityPhoto {
  _id: string;
  imageUrl: string;
  postUrl?: string;
}

export async function getCommunityPosts(): Promise<CommunityPhoto[]> {
  try {
    await connectDB();
    const docs = await CommunityPost.find({ isActive: true }).sort({ order: 1 }).lean();
    return docs.map((d: any) => ({
      _id: d._id.toString(),
      imageUrl: `/api/images/${d.imageFileId.toString()}`,
      postUrl: d.postUrl || undefined,
    }));
  } catch {
    return [];
  }
}
