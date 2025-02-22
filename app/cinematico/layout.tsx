import { Sidebar } from '@/components/cinematico/sidebar';
import { isAuthorized } from '@/utils/data/user/isAuthorized';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface CinematicoLayoutProps {
  children: React.ReactNode;
}

export default async function CinematicoLayout({
  children,
}: CinematicoLayoutProps) {
  const user = await currentUser();
  const { authorized } = await isAuthorized(user?.id!);

  // enable this in production to redirect unpaid users
  // if (!authorized) {
  //   console.log('not authorized');
  //   redirect('/not-subscriber');
  // }

  return (
    <div className="flex h-screen overflow-hidden w-full relative bg-gradient-to-br from-[#1A0B3F] via-[#2D1B5A] to-[#3D2A75]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden ml-20 relative z-0">
        {children}
      </main>
    </div>
  );
}
