'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createCoupon, deleteCoupon, toggleCoupon, type CouponFormState } from '@/actions/coupons';

interface CouponItem {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usedCount: number;
  isActive: boolean;
}

const initialState: CouponFormState = { success: false };

export default function CouponManager({ coupons }: { coupons: CouponItem[] }) {
  const [state, formAction] = useActionState(createCoupon, initialState);

  useEffect(() => {
    if (state.success) toast.success('Coupon created.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl2 border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Used</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center font-body text-sm text-ash-light">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 font-body text-sm text-fog">{c.code}</td>
                    <td className="px-5 py-4 font-body text-sm text-ash-light">
                      {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-ash-light">{c.usedCount}</td>
                    <td className="px-5 py-4 font-body text-xs">
                      <form action={toggleCoupon.bind(null, c._id, !c.isActive)}>
                        <button
                          type="submit"
                          className="rounded-full bg-white/5 px-2.5 py-1 text-fog transition-colors hover:bg-white/10"
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <form action={deleteCoupon.bind(null, c._id)}>
                        <button
                          type="submit"
                          aria-label="Delete coupon"
                          className="text-ash-dark hover:text-fog"
                        >
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form action={formAction} className="h-fit space-y-4 rounded-xl2 border border-line bg-white/5 p-6">
        <h3 className="font-display text-base font-semibold text-fog">New Coupon</h3>
        <input
          name="code"
          required
          placeholder="Code, e.g. WELCOME10"
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        <select
          name="type"
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        >
          <option value="percentage">Percentage off</option>
          <option value="fixed">Fixed amount off</option>
        </select>
        <input
          name="value"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="Value"
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Coupon'}
    </button>
  );
}
