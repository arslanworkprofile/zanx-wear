import { Schema, model, models, Document, Types } from 'mongoose';

export type UserRole = 'customer' | 'admin' | 'manager';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // absent for OAuth-only accounts
  image?: string;
  role: UserRole;
  provider: 'credentials' | 'google';
  emailVerified?: Date | null;
  addresses: Types.ObjectId[];
  wishlist: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image: { type: String },
    role: { type: String, enum: ['customer', 'admin', 'manager'], default: 'customer' },
    provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
    emailVerified: { type: Date, default: null },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export default models.User || model<IUser>('User', UserSchema);
