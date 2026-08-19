'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Order, { type OrderStatus } from '@/models/Order';

const VALID_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'on-hold',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
  return session;
}

export type OrderActionResult = { success: boolean; error?: string };

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<OrderActionResult> {
  try {
    await requireAdmin();

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      return { success: false, error: 'Invalid status.' };
    }

    const db = await safeConnectDB();
    if (!db.ok) return { success: false, error: db.error };

    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = status as OrderStatus;

    // Keep payment status in sync with a couple of obvious cases so the two
    // fields don't visibly contradict each other in the admin UI.
    if (status === 'delivered' && order.payment.provider === 'cod') {
      order.payment.status = 'paid';
      order.payment.paidAt = order.payment.paidAt ?? new Date();
    }
    if (status === 'refunded') {
      order.payment.status = 'refunded';
    }

    await order.save();

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err) {
    console.error('updateOrderStatus failed:', err);
    return { success: false, error: 'Unauthorized or something went wrong.' };
  }
}

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string
): Promise<OrderActionResult> {
  try {
    await requireAdmin();

    const db = await safeConnectDB();
    if (!db.ok) return { success: false, error: db.error };

    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.trackingNumber = trackingNumber.trim() || undefined;
    await order.save();

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err) {
    console.error('updateOrderTracking failed:', err);
    return { success: false, error: 'Unauthorized or something went wrong.' };
  }
}

/**
 * Lets a customer remove an order from their own "My Orders" list. This is a
 * soft delete (sets hiddenByCustomer) rather than a real database deletion —
 * the order stays intact in the admin panel and database for your business
 * records (accounting, dispute handling, sales history). Only the customer's
 * own view is affected.
 */
export async function deleteOwnOrder(orderId: string): Promise<OrderActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'You must be signed in.' };

    const db = await safeConnectDB();
    if (!db.ok) return { success: false, error: db.error };

    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    const belongsToUser =
      order.user?.toString() === session.user.id ||
      (session.user.email && order.guestEmail === session.user.email);

    if (!belongsToUser) {
      return { success: false, error: 'You can only remove your own orders.' };
    }

    order.hiddenByCustomer = true;
    await order.save();

    revalidatePath('/account/orders');
    return { success: true };
  } catch (err) {
    console.error('deleteOwnOrder failed:', err);
    return { success: false, error: 'Something went wrong.' };
  }
}
