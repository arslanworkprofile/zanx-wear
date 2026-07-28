'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addAddress, deleteAddress, type AddressFormState } from '@/actions/addresses';

interface AddressItem {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

const initialState: AddressFormState = { success: false };

export default function AddressManager({ addresses }: { addresses: AddressItem[] }) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [state, formAction] = useActionState(addAddress, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('Address saved.');
      setShowForm(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className="flex items-start justify-between rounded-xl2 border border-line bg-white/5 p-5"
        >
          <div>
            <p className="font-body text-sm text-fog">
              {addr.label} — {addr.fullName}
            </p>
            <p className="mt-1 font-body text-xs text-ash-light">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}
              {addr.state ? `, ${addr.state}` : ''} {addr.postalCode}, {addr.country}
            </p>
            <p className="mt-1 font-body text-xs text-ash-dark">{addr.phone}</p>
          </div>
          <form action={deleteAddress.bind(null, addr._id)}>
            <button
              type="submit"
              aria-label="Delete address"
              className="text-ash-dark hover:text-fog"
            >
              <Trash2 size={16} />
            </button>
          </form>
        </div>
      ))}

      {showForm ? (
        <form action={formAction} className="grid gap-3 rounded-xl2 border border-line bg-white/5 p-5 sm:grid-cols-2">
          <Input name="label" placeholder="Label (e.g. Home)" defaultValue="Home" />
          <Input name="fullName" placeholder="Full name" />
          <Input name="phone" placeholder="Phone" />
          <Input name="country" placeholder="Country" />
          <Input name="line1" placeholder="Address line 1" className="sm:col-span-2" />
          <Input name="line2" placeholder="Address line 2 (optional)" className="sm:col-span-2" />
          <Input name="city" placeholder="City" />
          <Input name="state" placeholder="State / Province (optional)" />
          <Input name="postalCode" placeholder="Postal code" />
          <SubmitButton />
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 font-body text-sm text-ash-light hover:text-fog"
        >
          <Plus size={15} /> Add a new address
        </button>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      required={props.required ?? !props.placeholder?.includes('optional')}
      className={`h-11 rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none ${props.className ?? ''}`}
    />
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-span-2"
    >
      {pending ? 'Saving...' : 'Save Address'}
    </button>
  );
}
