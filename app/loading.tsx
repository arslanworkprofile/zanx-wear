export default function Loading() {
  return (
    <div className="min-h-screen bg-matte-black pt-20">
      <div className="container-fluid py-20">
        <div className="mb-6 h-4 w-40 animate-pulse rounded-full bg-matte-800" />
        <div className="mb-10 h-14 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-matte-800 md:h-20" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] animate-pulse rounded-xl2 bg-matte-800" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-matte-800" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-matte-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
