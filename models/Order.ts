import { Schema, model, models, Document, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentProvider = 'stripe' | 'paypal' | 'jazzcash' | 'easypaisa' | 'cod';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image?: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId; // absent for guest checkout
  guestEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: IOrder['shippingAddress'];
  payment: {
    provider: PaymentProvider;
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: Date;
  };
  status: OrderStatus;
  trackingNumber?: string;
  hiddenByCustomer?: boolean;
  cancelledBy?: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const AddressSubSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    shippingAddress: { type: AddressSubSchema, required: true },
    billingAddress: { type: AddressSubSchema },
    payment: {
      provider: {
        type: String,
        enum: ['stripe', 'paypal', 'jazzcash', 'easypaisa', 'cod'],
        required: true,
      },
      status: { type: String, enum: ['unpaid', 'paid', 'failed', 'refunded'], default: 'unpaid' },
      transactionId: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'on-hold', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    trackingNumber: { type: String },
    hiddenByCustomer: { type: Boolean, default: false },
    cancelledBy: { type: String, enum: ['customer', 'admin'] },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default models.Order || model<IOrder>('Order', OrderSchema);
