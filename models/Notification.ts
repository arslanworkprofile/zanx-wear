import { Schema, model, models, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user?: Types.ObjectId; // absent = broadcast/admin notification
  type: 'order' | 'stock' | 'system' | 'promo';
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['order', 'stock', 'system', 'promo'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export default models.Notification || model<INotification>('Notification', NotificationSchema);
