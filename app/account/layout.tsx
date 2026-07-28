import { auth } from '@/lib/auth';
import AccountSidebar from '@/components/account/AccountSidebar';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-matte-black pt-32">
      <div className="container-fluid pb-24">
        <div className="mb-10">
          <span className="eyebrow">My Account</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog">
            Account
          </h1>
        </div>
        <div className="flex flex-col gap-10 md:flex-row">
          <AccountSidebar
            name={session?.user?.name}
            email={session?.user?.email}
            role={session?.user?.role}
          />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
