import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/models/Order';

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20',
  processing: 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20',
  'on-hold': 'bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/20',
  shipped: 'bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20',
  cancelled: 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20',
  refunded: 'bg-white/10 text-ash-light ring-1 ring-white/10',
};

const LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  'on-hold': 'On Hold',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrderStatusBadge({
  status,
  cancelledBy,
}: {
  status: string;
  cancelledBy?: 'customer' | 'admin';
}) {
  const key = (status as OrderStatus) in STYLES ? (status as OrderStatus) : 'pending';
  const label =
    key === 'cancelled' && cancelledBy === 'customer' ? 'Cancelled by customer' : LABELS[key];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium capitalize',
        STYLES[key]
      )}
    >
      {label}
    </span>
  );
}
