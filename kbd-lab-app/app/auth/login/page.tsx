import { LoginForm } from '@/components/login-form';
import { AnimatedBackground } from '@/components/animated-background';

export default function Page() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-900 to-black relative'>
      <div className='w-full max-w-sm z-10'>
        <LoginForm />
      </div>
      <div className='absolute inset-0 w-full h-full overflow-hidden'>
        <div className='absolute inset-0 opacity-50'>
          <AnimatedBackground />
        </div>
      </div>
    </div>
  );
}
