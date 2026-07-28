import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { authConfig } from '@/lib/auth.config';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Full config used by API routes and Server Actions/Components (Node runtime).
// Extends the edge-safe authConfig and adds the Credentials (email/password)
// provider, which needs Mongoose + bcrypt and can never be imported by
// middleware. Google sign-in has been removed — email/password only.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        try {
          await connectDB();
        } catch (err) {
          console.error(
            '[auth] Could not reach MongoDB. Check MONGODB_URI in .env.local — see error below:'
          );
          console.error(err);
          // Throwing here (instead of returning null) surfaces a clear
          // "Configuration" error on /login instead of a silent failure.
          throw new Error('DatabaseConnectionError');
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Persist role + id onto the JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? 'customer';
        token.id = user.id;
      }
      return token;
    },
    // Expose role + id on the client session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? 'customer';
      }
      return session;
    },
  },
});
