import { connectDB } from '@/lib/mongodb';
import Settings from '@/models/Settings';

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

const DEFAULT_SOCIAL: SocialLinks = {};

/**
 * Public, read-only settings needed by storefront chrome (currently just the
 * footer's social icons). Safe to call from anywhere — falls back to empty
 * links rather than throwing if the DB isn't reachable, so a Mongo hiccup
 * never breaks the whole site's layout.
 */
export async function getSocialLinks(): Promise<SocialLinks> {
  try {
    await connectDB();
    const doc = await Settings.findOne().select('social').lean<{ social?: SocialLinks }>();
    return doc?.social ?? DEFAULT_SOCIAL;
  } catch {
    return DEFAULT_SOCIAL;
  }
}
