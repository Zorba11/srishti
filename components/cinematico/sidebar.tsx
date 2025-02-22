'use client';
import Link from 'next/link';
import { UserProfile } from '@/components/user-profile';

export function Sidebar() {
  return (
    <div
      className="fixed left-0 top-0 h-screen w-20 flex flex-col justify-between py-6 z-50 transition-all duration-300 ease-in-out backdrop-blur-lg"
      style={{
        // A glassmorphic background: a light translucent white with a blur and saturation effect
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px) saturate(150%)',
      }}
    >
      {/* Top Icon / Logo */}
      <Link href="/cinematico">
        <div
          className="mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110"
          style={{
            background:
              'linear-gradient(145deg, rgba(147, 51, 234, 0.9), rgba(124, 58, 237, 0.9))',
            backdropFilter: 'blur(4px)',
            boxShadow: `
              4px 4px 8px rgba(0, 0, 0, 0.2),
              -2px -2px 4px rgba(255, 255, 255, 0.05),
              inset 0 0 32px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        </div>
      </Link>

      {/* Bottom section with user profile */}
      <div className="px-2">
        <UserProfile />
      </div>
    </div>
  );
}
