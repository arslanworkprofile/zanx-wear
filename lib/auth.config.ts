import type { NextAuthConfig } from 'next-auth';

/**
 * This config is intentionally free of anything that needs the Node.js runtime
 * (Mongoose, bcryptjs). Next.js middleware runs on the Edge Runtime, so it can
 * only import this file — not the full config in lib/auth.ts, which adds the
 * Credentials provider (and therefore a Mongoose/bcrypt import chain).
 *
 * Providers are intentionally empty here — middleware only needs the
 * `authorized` callback below to decide route access from the session token.
 * The real Credentials provider lives in lib/auth.ts.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith('/admin');
      const isAccountRoute = pathname.startsWith('/account');

      if (isAdminRoute) {
        const role = (auth?.user as any)?.role;
        return role === 'admin' || role === 'manager';
      }
      if (isAccountRoute) {
        return !!auth?.user;
      }
      return true;
    },
    // Without this, middleware's `auth?.user` never has `role`/`id` on it —
    // those only get attached to the JWT by lib/auth.ts's own `jwt` callback
    // during actual sign-in, but middleware still needs to read them back off
    // the token here to decide route access. This is plain field access on an
    // already-decoded token, so it's safe to run on the Edge Runtime.
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? 'customer';
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
