import { connectDB } from '@/lib/mongodb';

/**
 * Wraps connectDB() so every server action gets the same behavior on a
 * connection failure: log the real error server-side, and return a plain
 * result the action can turn into a user-facing message — instead of letting
 * an unhandled rejection crash the whole page with Next.js's generic
 * "Application error" screen.
 */
export async function safeConnectDB(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await connectDB();
    return { ok: true };
  } catch (err) {
    console.error('[db] Could not connect. Check MONGODB_URI in .env.local:', err);
    return {
      ok: false,
      error: 'Could not reach the database. Check MONGODB_URI in .env.local.',
    };
  }
}
