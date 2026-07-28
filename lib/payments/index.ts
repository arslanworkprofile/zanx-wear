/**
 * Payment gateway abstraction.
 *
 * The checkout flow only ever talks to `createPaymentIntent` / `verifyPayment`.
 * Each provider below is a stub that returns a clear "not configured" result
 * until you add real credentials to .env.local. Wire a provider by:
 *   1. Adding its secret keys to .env.local (see .env.example)
 *   2. Filling in the corresponding function's TODO
 *   3. Nothing else needs to change — actions/checkout.ts calls this file only.
 */

export type PaymentProvider = 'stripe' | 'paypal' | 'jazzcash' | 'easypaisa' | 'cod';

export interface PaymentIntentInput {
  provider: PaymentProvider;
  amount: number; // in the smallest currency unit (e.g. cents)
  currency: string;
  orderNumber: string;
  customerEmail?: string;
}

export interface PaymentIntentResult {
  success: boolean;
  redirectUrl?: string; // for hosted checkout pages (JazzCash, PayPal, Stripe Checkout)
  clientSecret?: string; // for Stripe Elements / Payment Intents
  transactionId?: string;
  error?: string;
}

export async function createPaymentIntent(
  input: PaymentIntentInput
): Promise<PaymentIntentResult> {
  switch (input.provider) {
    case 'stripe':
      return createStripeIntent(input);
    case 'paypal':
      return createPaypalOrder(input);
    case 'jazzcash':
      return createJazzCashSession(input);
    case 'easypaisa':
      return createEasypaisaSession(input);
    case 'cod':
      return { success: true, transactionId: `COD-${input.orderNumber}` };
    default:
      return { success: false, error: 'Unknown payment provider' };
  }
}

async function createStripeIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { success: false, error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY.' };
  }
  // TODO: install the `stripe` package and create a real PaymentIntent, e.g.:
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //   const intent = await stripe.paymentIntents.create({ amount: input.amount, currency: input.currency });
  //   return { success: true, clientSecret: intent.client_secret ?? undefined };
  return { success: false, error: 'Stripe integration not yet implemented' };
}

async function createPaypalOrder(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return { success: false, error: 'PayPal is not configured yet.' };
  }
  // TODO: call PayPal Orders v2 API to create an order and return its approval link.
  return { success: false, error: 'PayPal integration not yet implemented' };
}

async function createJazzCashSession(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  if (!process.env.JAZZCASH_MERCHANT_ID) {
    return { success: false, error: 'JazzCash is not configured yet.' };
  }
  // TODO: build the JazzCash HTTP POST payload (pp_Amount, pp_MerchantID, pp_TxnRefNo, ...),
  // sign it with JAZZCASH_INTEGRITY_SALT (HMAC-SHA256), and return the hosted checkout URL.
  return { success: false, error: 'JazzCash integration not yet implemented' };
}

async function createEasypaisaSession(input: PaymentIntentInput): Promise<PaymentIntentResult> {
  if (!process.env.EASYPAISA_STORE_ID) {
    return { success: false, error: 'Easypaisa is not configured yet.' };
  }
  // TODO: build the Easypaisa hosted checkout request per their merchant API docs.
  return { success: false, error: 'Easypaisa integration not yet implemented' };
}

export async function verifyPayment(
  provider: PaymentProvider,
  payload: Record<string, unknown>
): Promise<{ verified: boolean; transactionId?: string }> {
  // TODO: implement webhook/callback verification per provider
  // (Stripe: verify webhook signature; PayPal: verify webhook event;
  //  JazzCash/Easypaisa: verify the response hash against your integrity salt/hash key).
  return { verified: false };
}
