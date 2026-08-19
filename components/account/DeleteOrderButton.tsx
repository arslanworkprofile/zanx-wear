'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteOwnOrder } from '@/actions/orders';

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOwnOrder(orderId);
      if (result.success) {
        toast.success('Order removed from your history.');
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
        <span className="font-body text-xs text-ash-light">Remove this order?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="font-body text-xs font-medium text-fog underline underline-offset-4 disabled:opacity-50"
        >
          {isPending ? 'Removing…' : 'Yes, remove'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="font-body text-xs text-ash-dark underline underline-offset-4"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Remove order"
      className="flex items-center gap-1.5 font-body text-xs text-ash-dark transition-colors hover:text-fog"
    >
      <Trash2 size={13} />
      Remove
    </button>
  );
}
