/**
 * One-off utility: resets the password of the user matching ADMIN_EMAIL
 * (in .env.local) to ADMIN_PASSWORD, and makes sure their role is 'admin'.
 * Use this when an admin account already exists but you're not sure what
 * password it currently has (e.g. it was created via /register, not seed).
 *
 * Run with: npx tsx scripts/reset-admin-password.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

async function run() {
  const { connectDB } = await import('../lib/mongodb');
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default ?? bcryptModule;
  const { default: User } = await import('../models/User');

  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.');
    process.exit(1);
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email ${email}. Run "npm run seed" instead to create one.`);
    process.exit(1);
  }

  user.password = await bcrypt.hash(password, 12);
  user.role = 'admin';
  await user.save();

  console.log(`✔ Password reset for ${email}. Role confirmed as 'admin'.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
