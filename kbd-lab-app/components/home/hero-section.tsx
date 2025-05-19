import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className='w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:py-32'>
      <div className='container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8'>
        <div className='flex-1 space-y-6'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            <span className='text-[#61dafb]'>KBD</span> Lab
          </h1>
          <p className='text-xl md:text-2xl text-gray-600'>
            自作キーボード愛好家のためのカタログサイト
          </p>
          <p className='text-gray-600 max-w-md'>
            お気に入りのキーボード、キーキャップ、小物を見つけよう。あなたの作品を共有しよう。
          </p>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='relative w-full max-w-md aspect-square'>
            <Image
              src='/keyboard-hero.svg'
              alt='キーボードイラスト'
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
