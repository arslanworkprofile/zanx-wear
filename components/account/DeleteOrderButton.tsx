'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { deleteOwnOrder } from '@/actions/orders';

const CANCELLABLE_STATUSES = ['pending', 'processing', 'on-hold'];

export default function DeleteOrderButton({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Orders still in progress get genuinely cancelled (and the admin panel
  // will show that). Orders already shipped/delivered/refunded/cancelled
  // just get hidden from this list — cancelling no longer applies to them.
  const willCancel = CANCELLABLE_STATUSES.includes(status);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOwnOrder(orderId);
      if (result.success) {
        toast.success(willCancel ? 'Order cancelled.' : 'Order removed from your history.');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Could not remove order.');
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-ash-light">
          {willCancel ? 'Cancel this order?' : 'Remove this order from your history?'}
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="font-body text-xs font-medium text-fog underline underline-offset-4 disabled:opacity-50"
        >
          {isPending ? 'Working…' : willCancel ? 'Yes, cancel' : 'Yes, remove'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="flex items-center text-ash-dark hover:text-fog"
          aria-label="Never mind"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={willCancel ? 'Cancel order' : 'Remove order'}
      className="flex items-center gap-1.5 font-body text-xs text-ash-dark transition-colors hover:text-fog"
    >
      <Trash2 size={13} />
      {willCancel ? 'Cancel Order' : 'Remove'}
    </button>
  );
}
