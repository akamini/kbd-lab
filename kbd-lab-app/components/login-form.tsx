'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="backdrop-blur-sm bg-black/30 border-slate-700 shadow-lg shadow-purple-500/20">
        <CardHeader>
          <CardTitle className='text-2xl text-purple-300'>ようこそ！</CardTitle>
          <CardDescription className="text-slate-300">続けるにはアカウントにサインインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSocialLogin}>
            <div className='flex flex-col gap-6'>
              {error && <p className='text-sm text-red-400'>{error}</p>}
              <Button 
                type='submit' 
                className='w-full bg-purple-600 hover:bg-purple-700 text-white' 
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'Githubで続ける'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
