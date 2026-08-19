import { connectDB } from '@/lib/mongodb';
import CommunityPost from '@/models/CommunityPost';
import CommunityManager from '@/components/admin/CommunityManager';

async function getPosts() {
  try {
    await connectDB();
    const docs = await CommunityPost.find().sort({ order: 1 }).lean();
    return {
      posts: docs.map((d: any) => ({
        _id: d._id.toString(),
        imageUrl: `/api/images/${d.imageFileId.toString()}`,
        postUrl: d.postUrl || '',
      })),
      connected: true,
    };
  } catch {
    return { posts: [], connected: false };
  }
}

export default async function AdminCommunityPage() {
  const { posts, connected } = await getPosts();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Homepage</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Community Gallery
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-ash-light">
          These photos power the &ldquo;Styled by the community&rdquo; section on your homepage.
          Upload photos here (screenshots or saves from Instagram work fine) and optionally link
          each one back to the original post.
        </p>
      </div>

      {!connected && (
        <div className="mb-6 rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          Not connected to MongoDB Atlas — connect your database to manage the gallery here.
        </div>
      )}

      <CommunityManager posts={posts} />
    </div>
  );
}
