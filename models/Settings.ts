import { Schema, model, models, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImageFileId?: string;
  };
  email: {
    fromName: string;
    fromAddress: string;
  };
  shipping: {
    flatRate: number;
    freeShippingThreshold: number;
  };
  maintenanceMode: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'ZANX WEAR' },
    siteTagline: { type: String, default: 'Wear the Standard.' },
    supportEmail: { type: String, default: 'support@zanxwear.com' },
    seo: {
      defaultTitle: { type: String, default: 'ZANX WEAR — Premium Clothing & Accessories' },
      defaultDescription: {
        type: String,
        default: 'Modern, minimal, premium fashion for men and women.',
      },
      ogImageFileId: { type: String },
    },
    email: {
      fromName: { type: String, default: 'ZANX WEAR' },
      fromAddress: { type: String, default: 'no-reply@zanxwear.com' },
    },
    shipping: {
      flatRate: { type: Number, default: 5 },
      freeShippingThreshold: { type: Number, default: 100 },
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Settings || model<ISettings>('Settings', SettingsSchema);
