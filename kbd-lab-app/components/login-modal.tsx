'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export function LoginModal() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // URLパラメータにlogin=trueがある場合、モーダルを自動的に開く
    if (searchParams.get('login') === 'true') {
      setOpen(true);
    }
  }, [searchParams]);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-[#61dafb] hover:bg-[#4db8e0] text-white'>
          ログイン / 登録
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            ようこそ！
          </DialogTitle>
          <DialogDescription className='text-gray-600 mt-2'>
            続けるにはアカウントにサインインしてください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSocialLogin}>
          <div className='flex flex-col gap-6 py-4'>
            {error && (
              <div className='p-3 rounded-md bg-red-50 border border-red-200'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}
            <Button
              type='submit'
              className='w-full bg-[#61dafb] hover:bg-[#4db8e0] text-white font-medium transition-all duration-300 flex items-center justify-center gap-2'
              disabled={isLoading}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'></path>
                <path d='M9 18c-4.51 2-5-2-7-2'></path>
              </svg>
              {isLoading ? 'ログイン中...' : 'Githubで続ける'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
