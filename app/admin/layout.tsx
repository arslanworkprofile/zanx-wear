import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Middleware already redirects unauthenticated/unauthorized requests away from
  // /admin, but this second check keeps the layout safe if it's ever rendered
  // directly (e.g. during static analysis or if middleware config changes).
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-matte-black">
      <AdminSidebar />
      <div className="md:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</div>
      </div>
    </div>
  );
}
