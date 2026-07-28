import { Schema, model, models, Document, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  size: string;
  color: string;
  quantity: number;
}

export interface ICart extends Document {
  user?: Types.ObjectId;
  sessionId?: string; // for guest carts, tied to a signed cookie
  items: ICartItem[];
  couponCode?: string;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String },
    items: { type: [CartItemSchema], default: [] },
    couponCode: { type: String },
  },
  { timestamps: true }
);

CartSchema.index({ user: 1 }, { unique: true, sparse: true });
CartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });

export default models.Cart || model<ICart>('Cart', CartSchema);
