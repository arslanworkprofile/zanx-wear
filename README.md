# ZANX WEAR

Premium fashion eCommerce platform — Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, MongoDB Atlas.

## Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Shadcn-style UI primitives, Lucide icons, React Hook Form + Zod
- **Backend:** Next.js Server Actions + API Routes, MongoDB Atlas, Mongoose
- **Auth:** Auth.js (NextAuth v5) — Credentials (email/password) + Google, JWT sessions
- **Images:** Stored directly in MongoDB Atlas via GridFS (no Cloudinary/Firebase/third-party hosting)
- **Payments:** Provider-agnostic interface ready for Stripe, PayPal, JazzCash, Easypaisa

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in:
   - `MONGODB_URI` — create a free cluster at https://www.mongodb.com/cloud/atlas, whitelist your IP (or `0.0.0.0/0` for dev), and grab the connection string.
   - `AUTH_SECRET` — generate with `npx auth secret` or `openssl rand -base64 32`.
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from https://console.cloud.google.com/apis/credentials (only needed for Google login).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used once by the seed script to create your first admin account.

3. **Seed the database** (creates admin user + starter categories)
   ```bash
   npm run seed
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all the same environment variables from `.env.local` to the Vercel project's Environment Variables settings.
4. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Run `npm run seed` locally pointed at your production `MONGODB_URI` once, to create your admin account.

## Connecting payment gateways

All checkout logic calls a single file: `lib/payments/index.ts`. Each provider (Stripe, PayPal, JazzCash, Easypaisa) has a stub function with a `TODO` showing exactly what to fill in and which package/API to call. Nothing in the UI or Server Actions needs to change when you wire a provider — they only ever call `createPaymentIntent()`.

## What's built

- Full folder architecture (components, lib, hooks, services, utils, types, actions, models, middleware, store, contexts, styles)
- Mongoose models: User, Product, Category, Order, Coupon, Review, Address, Cart, Notification, Settings
- GridFS image upload/read/delete (admin-only upload route, drag-and-drop ready)
- Auth.js with Credentials + Google, JWT sessions, role-based middleware for `/admin` and `/account`
- Zustand cart + wishlist stores
- Fully animated Home page (Hero, Categories, Featured/Trending/New Arrivals, Sale banner, Testimonials, Instagram feed, Newsletter)
- Shop listing with filters, sorting, pagination
- Product detail page with gallery, variants, size guide, reviews
- Cart + Checkout flow (guest checkout supported)
- Shared Navbar, mini-cart drawer, Footer, loading skeleton, 404 page

## Notes

- Product photography in the mock data is represented with CSS gradient tiles until you upload real images through the admin panel — swap `lib/mock-data.ts` for real Server Action data fetches once your catalog is populated.
- `sharp` (used for image compression/thumbnails in `lib/gridfs.ts`) needs a Node.js server runtime — already the default for API routes here; don't move that logic to an Edge runtime.
- The Admin panel (dashboard, product/order/category CRUD, analytics) is the next layer to build — the data models, auth middleware, and upload routes it needs are already in place.
