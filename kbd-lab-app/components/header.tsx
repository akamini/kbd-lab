'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/logout-button';
import { LoginModal } from '@/components/login-modal';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchUser();

    // ユーザー認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className='w-full bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
        <div className='flex items-center space-x-8'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-2xl font-bold'>
              <span className='text-[#61dafb]'>KBD</span> Lab
            </span>
          </Link>
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/products/keyboards'
              className='text-gray-600 hover:text-[#61dafb]'
            >
              キーボード
            </Link>
            <Link
              href='/products/keycaps'
              className='text-gray-600 hover:text-[#61dafb]'
            >
              キーキャップ
            </Link>
            <Link
              href='/products/accessories'
              className='text-gray-600 hover:text-[#61dafb]'
            >
              小物
            </Link>
            <Link
              href='/products/tools'
              className='text-gray-600 hover:text-[#61dafb]'
            >
              工具
            </Link>
          </nav>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='relative hidden md:block'>
            <input
              type='text'
              placeholder='検索...'
              className='w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:border-transparent'
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#61dafb]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
          {user ? (
            <div className='flex items-center space-x-4'>
              <Button
                asChild
                variant='ghost'
                className='text-gray-600 hover:text-[#61dafb]'
              >
                <Link href='/profile'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  マイページ
                </Link>
              </Button>
              <LogoutButton />
            </div>
          ) : (
            <LoginModal />
          )}
          <button className='md:hidden text-gray-600 hover:text-[#61dafb]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
