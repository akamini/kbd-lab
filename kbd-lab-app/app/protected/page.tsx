import { redirect } from 'next/navigation';

import { LogoutButton } from '@/components/logout-button';
import { createClient } from '@/lib/supabase/server';
import { AnimatedBackground } from '@/components/animated-background';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth/login');
  }

  return (
    <div className='relative flex h-svh w-full items-center justify-center bg-gradient-to-br from-gray-900 to-black'>
      <AnimatedBackground />
      <div className='z-10 flex flex-col items-center gap-4 rounded-lg backdrop-blur-sm bg-black/30 p-8 border border-[#61dafb]/20 shadow-lg shadow-[#61dafb]/20'>
        <h1 className='text-2xl font-bold text-[#61dafb]'>ダッシュボード</h1>
        <p className='text-slate-300'>
          こんにちは{' '}
          <span className='font-semibold text-[#61dafb]'>
            {data.user.email}
          </span>{' '}
          さん
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
