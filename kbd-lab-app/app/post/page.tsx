'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PostForm } from '@/components/post/post-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function PostPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/?login=true');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto max-w-4xl px-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              新しいプロダクトを投稿
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
