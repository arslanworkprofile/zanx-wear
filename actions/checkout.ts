'use server';

import { z } from 'zod';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';
import { createPaymentIntent, type PaymentProvider } from '@/lib/payments';

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean(),
  billingAddress: addressSchema.optional(),
  paymentProvider: z.enum(['stripe', 'paypal', 'jazzcash', 'easypaisa', 'cod']),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        size: z.string(),
        color: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface CheckoutResult {
  success: boolean;
  orderNumber?: string;
  redirectUrl?: string;
  error?: string;
}

function generateOrderNumber() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ZW-${Date.now().toString().slice(-6)}-${rand}`;
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid checkout data' };
  }
  const data = parsed.data;

  // If the customer is logged in, link the order to their account so it
  // shows up under Account → Orders. Guests (no session) still get an order
  // saved against just their email, same as before.
  const session = await auth();
  const userId = session?.user?.id;

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 100 ? 0 : 5;
  const discount = 0; // TODO: recompute against the Coupon collection server-side
  const total = subtotal - discount + shippingFee;

  const orderNumber = generateOrderNumber();

  const paymentResult = await createPaymentIntent({
    provider: data.paymentProvider as PaymentProvider,
    amount: Math.round(total * 100),
    currency: 'usd',
    orderNumber,
    customerEmail: data.email,
  });

  try {
    await connectDB();
    await Order.create({
      orderNumber,
      user: userId,
      guestEmail: data.email,
      items: data.items.map((i) => ({
        product: i.productId,
        name: i.name,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      discount,
      shippingFee,
      tax: 0,
      total,
      couponCode: data.couponCode,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingSameAsShipping ? data.shippingAddress : data.billingAddress,
      payment: {
        provider: data.paymentProvider,
        status: paymentResult.success && data.paymentProvider === 'cod' ? 'unpaid' : 'unpaid',
        transactionId: paymentResult.transactionId,
      },
      status: 'pending',
    });
  } catch (err) {
    console.error('Order creation failed:', err);
    return {
      success: false,
      error:
        'Could not save the order — check that MONGODB_URI is set and reachable (see .env.example).',
    };
  }

  if (data.paymentProvider !== 'cod' && !paymentResult.success) {
    // Order is saved as pending/unpaid; surface the gateway's message so the
    // checkout UI can prompt the customer (e.g. "Stripe not configured yet").
    return { success: false, error: paymentResult.error, orderNumber };
  }

  return { success: true, orderNumber, redirectUrl: paymentResult.redirectUrl };
}
