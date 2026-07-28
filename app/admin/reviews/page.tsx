import { Check, Trash2 } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { approveReview, deleteReview } from '@/actions/reviews';

async function getReviews() {
  try {
    await connectDB();
    const docs = await Review.find().sort({ createdAt: -1 }).limit(100).lean();
    return { reviews: docs, connected: true };
  } catch {
    return { reviews: [] as any[], connected: false };
  }
}

export default async function AdminReviewsPage() {
  const { reviews, connected } = await getReviews();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Moderation</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Reviews
        </h1>
      </div>

      {!connected ? (
        <EmptyBox message="Connect your MongoDB Atlas database to moderate reviews here." />
      ) : reviews.length === 0 ? (
        <EmptyBox message="No reviews submitted yet." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div
              key={r._id.toString()}
              className="flex items-start justify-between rounded-xl2 border border-line bg-white/5 p-5"
            >
              <div>
                <p className="font-body text-sm text-fog">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                  {r.title && <span className="ml-2 text-fog">{r.title}</span>}
                </p>
                <p className="mt-2 font-body text-sm text-ash-light">{r.comment}</p>
                <p className="mt-2 font-body text-xs text-ash-dark">
                  {r.isApproved ? 'Approved' : 'Pending approval'}
                </p>
              </div>
              <div className="flex gap-3">
                {!r.isApproved && (
                  <form action={approveReview.bind(null, r._id.toString())}>
                    <button
                      type="submit"
                      aria-label="Approve review"
                      className="text-ash-light hover:text-fog"
                    >
                      <Check size={16} />
                    </button>
                  </form>
                )}
                <form action={deleteReview.bind(null, r._id.toString())}>
                  <button
                    type="submit"
                    aria-label="Delete review"
                    className="text-ash-dark hover:text-fog"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center font-body text-sm text-ash-light">
      {message}
    </div>
  );
}
