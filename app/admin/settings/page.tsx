import { connectDB } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import SettingsForm from '@/components/admin/SettingsForm';

async function getSettings() {
  try {
    await connectDB();
    let doc = await Settings.findOne().lean();
    if (!doc) {
      const created = await Settings.create({});
      doc = created.toObject();
    }
    return {
      settings: JSON.parse(JSON.stringify(doc)),
      connected: true,
    };
  } catch {
    return {
      settings: {
        siteName: 'ZANX WEAR',
        siteTagline: 'Wear the Standard.',
        supportEmail: 'support@zanxwear.com',
        seo: { defaultTitle: '', defaultDescription: '' },
        shipping: { flatRate: 5, freeShippingThreshold: 100 },
      },
      connected: false,
    };
  }
}

export default async function AdminSettingsPage() {
  const { settings, connected } = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Configuration</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Settings
        </h1>
      </div>

      {!connected && (
        <div className="mb-6 max-w-2xl rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          Showing defaults — connect your MongoDB Atlas database to save changes here.
        </div>
      )}

      <SettingsForm settings={settings} />
    </div>
  );
}
