'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

const registerSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterState = {
  success: boolean;
  error?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { name, email, password } = parsed.data;

  try {
    await connectDB();
  } catch (err) {
    console.error('[registerUser] Could not reach MongoDB:', err);
    return {
      success: false,
      error: 'Could not reach the database. Check MONGODB_URI in .env.local.',
    };
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email,
    password: hashed,
    provider: 'credentials',
    role: 'customer',
  });

  return { success: true };
}
