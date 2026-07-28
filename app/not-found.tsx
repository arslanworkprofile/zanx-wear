import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-matte-black px-6 text-center">
      <span className="eyebrow">Error 404</span>
      <h1 className="mt-4 font-display text-7xl font-bold tracking-tightest2 text-fog md:text-9xl">
        Lost the thread
      </h1>
      <p className="mt-5 max-w-md font-body text-ash-light">
        The page you're looking for has been moved, sold out, or never existed.
      </p>
      <Button className="mt-9" size="lg" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
