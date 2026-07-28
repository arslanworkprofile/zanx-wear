/**
 * Run with: npm run seed
 * Creates the first admin user (from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local)
 * and a starter set of categories so the admin panel isn't empty on first login.
 *
 * NOTE: lib/mongodb.ts and friends read process.env.MONGODB_URI at import time.
 * Static `import` statements are hoisted above all other code in a module —
 * even above a dotenv config() call written earlier in the file — so those
 * modules must be loaded dynamically (await import(...)) *after* config()
 * actually runs, or they'd see an empty process.env.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

async function seed() {
  const { connectDB } = await import('../lib/mongodb');
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default ?? bcryptModule;
  const { default: User } = await import('../models/User');
  const { default: Category } = await import('../models/Category');
  const { default: Settings } = await import('../models/Settings');

  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before seeding.');
    process.exit(1);
  }

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({
      name: 'ZANX Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      provider: 'credentials',
      emailVerified: new Date(),
    });
    console.log(`✔ Admin user created: ${adminEmail}`);
  } else {
    console.log('• Admin user already exists, skipping.');
  }

  const categories = ['Outerwear', 'Knitwear', 'Denim', 'Footwear', 'Accessories', 'Essentials'];
  for (const [i, name] of categories.entries()) {
    const slug = name.toLowerCase();
    const found = await Category.findOne({ slug });
    if (!found) {
      await Category.create({ name, slug, order: i });
      console.log(`✔ Category created: ${name}`);
    }
  }

  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({});
    console.log('✔ Default site settings created');
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
