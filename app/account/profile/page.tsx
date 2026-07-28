import { auth } from '@/lib/auth';
import ProfileForm from '@/components/account/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="max-w-lg rounded-xl2 border border-line bg-white/5 p-6">
      <ProfileForm name={session?.user?.name ?? ''} email={session?.user?.email ?? ''} />
    </div>
  );
}
