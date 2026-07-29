'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateOrderStatus, updateOrderTracking } from '@/actions/orders';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export default function OrderStatusControl({
  orderId,
  currentStatus,
  currentTracking,
}: {
  orderId: string;
  currentStatus: string;
  currentTracking?: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking ?? '');
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: string) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (result.success) {
        toast.success(`Order marked as ${next.replace('-', ' ')}.`);
      } else {
        setStatus(previous);
        toast.error(result.error ?? 'Could not update status.');
      }
    });
  }

  function handleTrackingSave() {
    startTransition(async () => {
      const result = await updateOrderTracking(orderId, tracking);
      if (result.success) {
        toast.success('Tracking number saved.');
      } else {
        toast.error(result.error ?? 'Could not save tracking number.');
      }
    });
  }

  return (
    <div className="space-y-5 rounded-xl2 border border-line bg-white/5 p-5">
      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-wide text-ash-light">
          Order Status
        </label>
        <select
          value={status}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full rounded-lg border border-line bg-matte-900 px-3.5 py-2.5 font-body text-sm text-fog outline-none transition-colors focus:border-silver/40 disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-wide text-ash-light">
          Tracking Number
        </label>
        <div className="flex gap-2">
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. TCS123456789"
            className="w-full rounded-lg border border-line bg-matte-900 px-3.5 py-2.5 font-body text-sm text-fog outline-none transition-colors focus:border-silver/40"
          />
          <button
            onClick={handleTrackingSave}
            disabled={isPending}
            className="shrink-0 rounded-lg bg-fog px-4 py-2.5 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
