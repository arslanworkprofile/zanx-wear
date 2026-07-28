export type DefaultPage = { title: string; content: string };

// Slugs here match the footer links in components/layout/Footer.tsx.
// These are shown until an admin saves real content for that slug in the
// database (see actions/pages.ts + app/admin/pages).
export const DEFAULT_PAGES: Record<string, DefaultPage> = {
  shipping: {
    title: 'Shipping Information',
    content: `We offer standard shipping in 3–5 business days on all orders. Free shipping applies automatically to orders over $100.

Express shipping (1–2 business days) is available at checkout for an additional fee.

Orders are processed within 1 business day. You'll receive a tracking link by email as soon as your order ships.

International shipping times vary by destination and customs processing.`,
  },
  returns: {
    title: 'Return Policy',
    content: `We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have all original tags attached.

To start a return, contact us with your order number and we'll send you a prepaid return label.

Refunds are issued to your original payment method within 5–7 business days of us receiving your return.

Sale items are final sale and cannot be returned unless defective.`,
  },
  'size-guide': {
    title: 'Size Guide',
    content: `Find your best fit using the measurements below. All measurements are in inches.

XS — Chest 34, Waist 28
S — Chest 36, Waist 30
M — Chest 39, Waist 32
L — Chest 42, Waist 35
XL — Chest 45, Waist 38
XXL — Chest 48, Waist 41

If you're between sizes, we recommend sizing up for a more relaxed fit.`,
  },
  contact: {
    title: 'Contact Us',
    content: `Have a question about an order, a product, or anything else? Send us a message and we'll get back to you within 1 business day.

You can also reach us directly at support@zanxwear.com.`,
  },
  about: {
    title: 'About ZANX',
    content: `ZANX WEAR makes modern clothing and accessories, engineered with restraint.

We design considered essentials meant to be worn often and to hold their shape wear after wear — structured outerwear, clean knitwear, and quiet, durable basics.

Every piece is developed with an eye toward longevity, both in construction and in style, so it stays part of your wardrobe well past a single season.`,
  },
  careers: {
    title: 'Careers',
    content: `We're always looking for people who care about craft, quality, and considered design.

We don't have any open roles listed right now, but we'd love to hear from you. Send your resume and a note about what you're looking for to careers@zanxwear.com.`,
  },
  sustainability: {
    title: 'Sustainability',
    content: `We believe the most sustainable garment is the one you keep wearing.

We prioritize durable fabrics and construction methods designed to extend the life of each piece, and we're continually evaluating our supply chain for lower-impact materials and practices.

This page will be updated as our sustainability initiatives develop.`,
  },
  press: {
    title: 'Press',
    content: `For press inquiries, interview requests, or product imagery, please reach out to press@zanxwear.com.

We'll aim to respond within 2 business days.`,
  },
  privacy: {
    title: 'Privacy Policy',
    content: `We collect the information you provide directly to us (such as your name, email, and shipping address) to process orders and communicate with you.

We do not sell your personal information to third parties.

We use industry-standard measures to protect your data. You can request a copy of your data or ask us to delete it at any time by contacting support@zanxwear.com.`,
  },
  terms: {
    title: 'Terms of Service',
    content: `By using this site, you agree to purchase products for personal, non-commercial use only.

All content on this site, including images, text, and logos, is the property of ZANX WEAR and may not be used without permission.

Prices and availability are subject to change without notice. We reserve the right to refuse or cancel any order.`,
  },
};

export const EDITABLE_PAGE_SLUGS = Object.keys(DEFAULT_PAGES);
