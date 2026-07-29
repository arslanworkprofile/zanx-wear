'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { updateSettings, type SettingsFormState } from '@/actions/settings';

interface SettingsData {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  seo: { defaultTitle: string; defaultDescription: string };
  shipping: { flatRate: number; freeShippingThreshold: number };
  social: { instagram?: string; facebook?: string; twitter?: string; tiktok?: string };
}

const initialState: SettingsFormState = { success: false };

export default function SettingsForm({ settings }: { settings: SettingsData }) {
  const [state, formAction] = useActionState(updateSettings, initialState);

  useEffect(() => {
    if (state.success) toast.success('Settings saved.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <Section title="Website Settings">
        <Field label="Site name">
          <input name="siteName" defaultValue={settings.siteName} className="input" />
        </Field>
        <Field label="Tagline">
          <input name="siteTagline" defaultValue={settings.siteTagline} className="input" />
        </Field>
        <Field label="Support email">
          <input
            name="supportEmail"
            type="email"
            defaultValue={settings.supportEmail}
            className="input"
          />
        </Field>
      </Section>

      <Section title="SEO Settings">
        <Field label="Default meta title">
          <input name="seoTitle" defaultValue={settings.seo.defaultTitle} className="input" />
        </Field>
        <Field label="Default meta description">
          <textarea
            name="seoDescription"
            rows={3}
            defaultValue={settings.seo.defaultDescription}
            className="input resize-none"
          />
        </Field>
      </Section>

      <Section title="Shipping">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Flat rate (USD)">
            <input
              name="flatRate"
              type="number"
              step="0.01"
              defaultValue={settings.shipping.flatRate}
              className="input"
            />
          </Field>
          <Field label="Free shipping over (USD)">
            <input
              name="freeShippingThreshold"
              type="number"
              step="0.01"
              defaultValue={settings.shipping.freeShippingThreshold}
              className="input"
            />
          </Field>
        </div>
      </Section>

      <Section title="Social Links">
        <p className="-mt-2 mb-1 font-body text-xs text-ash-dark">
          Leave a field blank to hide that icon on the website. Use full URLs (e.g.
          https://instagram.com/yourbrand).
        </p>
        <Field label="Instagram URL">
          <input
            name="socialInstagram"
            type="url"
            placeholder="https://instagram.com/zanxwear"
            defaultValue={settings.social?.instagram ?? ''}
            className="input"
          />
        </Field>
        <Field label="Facebook URL">
          <input
            name="socialFacebook"
            type="url"
            placeholder="https://facebook.com/zanxwear"
            defaultValue={settings.social?.facebook ?? ''}
            className="input"
          />
        </Field>
        <Field label="Twitter / X URL">
          <input
            name="socialTwitter"
            type="url"
            placeholder="https://x.com/zanxwear"
            defaultValue={settings.social?.twitter ?? ''}
            className="input"
          />
        </Field>
        <Field label="TikTok URL">
          <input
            name="socialTiktok"
            type="url"
            placeholder="https://tiktok.com/@zanxwear"
            defaultValue={settings.social?.tiktok ?? ''}
            className="input"
          />
        </Field>
      </Section>

      <SubmitButton />

      <style jsx global>{`
        .input {
          height: 2.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          padding: 0 1rem;
          font-size: 0.875rem;
          color: #f2f2f0;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: rgba(200, 203, 208, 0.4);
        }
        textarea.input {
          height: auto;
          padding: 0.75rem 1rem;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-6">
      <h3 className="mb-5 font-display text-base font-semibold text-fog">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-body text-xs text-ash-light">{label}</label>
      {children}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 rounded-full bg-fog px-7 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Save Settings'}
    </button>
  );
}
