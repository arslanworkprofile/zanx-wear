import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'customer' | 'admin' | 'manager';
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'customer' | 'admin' | 'manager';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'customer' | 'admin' | 'manager';
  }
}
