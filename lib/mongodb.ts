import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // We intentionally don't throw at import time in every environment (e.g. during
  // `next build` static analysis) — only when a connection is actually attempted.
  console.warn(
    '[zanx-wear] MONGODB_URI is not set. Add it to .env.local before hitting any data route.'
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse the connection across hot-reloads / server action invocations in dev,
// and across warm Lambda invocations in serverless production.
declare global {
  // eslint-disable-next-line no-var
  var _zanxMongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._zanxMongoose ?? { conn: null, promise: null };
global._zanxMongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is missing. Set it in .env.local (see .env.example) before connecting.'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: 'zanxwear',
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
