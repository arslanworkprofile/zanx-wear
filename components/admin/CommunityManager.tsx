'use client';

import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { UploadCloud, X, ArrowUp, ArrowDown, Trash2, Instagram } from 'lucide-react';
import {
  addCommunityPosts,
  deleteCommunityPost,
  moveCommunityPost,
} from '@/actions/community';

interface Post {
  _id: string;
  imageUrl: string;
  postUrl: string;
}

interface PendingPhoto {
  fileId: string;
  url: string;
  postUrl: string;
}

export default function CommunityManager({ posts }: { posts: Post[] }) {
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPublishing, startPublish] = useTransition();
  const [isBusyId, setIsBusyId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Upload failed');
        return;
      }

      setPending((prev) => [
        ...prev,
        ...data.uploaded.map((u: any) => ({ fileId: u.fileId, url: u.url, postUrl: '' })),
      ]);
    } catch {
      toast.error('Upload failed. Check your database connection.');
    } finally {
      setUploading(false);
    }
  }

  function updatePendingLink(fileId: string, postUrl: string) {
    setPending((prev) => prev.map((p) => (p.fileId === fileId ? { ...p, postUrl } : p)));
  }

  function removePending(fileId: string) {
    setPending((prev) => prev.filter((p) => p.fileId !== fileId));
  }

  function publish() {
    if (pending.length === 0) return;
    startPublish(async () => {
      const result = await addCommunityPosts(
        pending.map((p) => ({ fileId: p.fileId, postUrl: p.postUrl }))
      );
      if (result.success) {
        toast.success(`${pending.length} photo${pending.length > 1 ? 's' : ''} published.`);
        setPending([]);
      } else {
        toast.error(result.error ?? 'Could not publish photos.');
      }
    });
  }

  function handleDelete(id: string) {
    setIsBusyId(id);
    deleteCommunityPost(id).finally(() => setIsBusyId(null));
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    setIsBusyId(id);
    moveCommunityPost(id, direction).finally(() => setIsBusyId(null));
  }

  return (
    <div className="space-y-8">
      {/* Upload zone */}
      <div className="rounded-xl2 border border-dashed border-line bg-white/5 p-6">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg py-6 text-ash-light transition-colors hover:text-fog disabled:opacity-50"
        >
          <UploadCloud size={22} strokeWidth={1.5} />
          <span className="font-body text-sm">
            {uploading ? 'Uploading…' : 'Click to upload photos (JPEG, PNG, or WEBP)'}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {pending.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {pending.map((p) => (
                <div key={p.fileId} className="space-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-white/5">
                    <img src={p.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePending(p.fileId)}
                      aria-label="Remove"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-matte-black/80 text-fog"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <input
                    value={p.postUrl}
                    onChange={(e) => updatePendingLink(p.fileId, e.target.value)}
                    placeholder="Instagram post link (optional)"
                    className="h-8 w-full rounded-md border border-line bg-matte-900 px-2.5 font-body text-xs text-fog outline-none focus:border-silver/40"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={publish}
              disabled={isPublishing}
              className="rounded-full bg-fog px-5 py-2.5 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPublishing
                ? 'Publishing…'
                : `Publish ${pending.length} photo${pending.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>

      {/* Published gallery */}
      <div>
        <p className="mb-3 font-body text-xs uppercase tracking-wide text-ash-light">
          Live on homepage ({posts.length})
        </p>
        {posts.length === 0 ? (
          <div className="rounded-xl2 border border-line bg-white/5 p-8 text-center font-body text-sm text-ash-light">
            No photos yet — upload some above to fill in the community section.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {posts.map((post, i) => (
              <div
                key={post._id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-white/5"
              >
                <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
                {post.postUrl && (
                  <div className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-matte-black/70 text-fog">
                    <Instagram size={12} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-matte-black/0 opacity-0 transition-all duration-200 group-hover:bg-matte-black/60 group-hover:opacity-100">
                  <button
                    type="button"
                    disabled={i === 0 || isBusyId === post._id}
                    onClick={() => handleMove(post._id, 'up')}
                    aria-label="Move earlier"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-fog disabled:opacity-30"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={i === posts.length - 1 || isBusyId === post._id}
                    onClick={() => handleMove(post._id, 'down')}
                    aria-label="Move later"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-fog disabled:opacity-30"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={isBusyId === post._id}
                    onClick={() => handleDelete(post._id)}
                    aria-label="Delete"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-fog disabled:opacity-30"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
