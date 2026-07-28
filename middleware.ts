import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Uses ONLY the edge-safe config (no Mongoose/bcrypt) — see lib/auth.config.ts
// for why this must stay separate from lib/auth.ts. Route protection logic
// itself lives in authConfig's `authorized` callback.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
