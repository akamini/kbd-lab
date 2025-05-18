'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Button
      onClick={logout}
      className='bg-[#61dafb] hover:bg-[#50c9ea] text-gray transition-all duration-300 ease-in-out transform hover:scale-105'
    >
      ログアウト
    </Button>
  );
}
