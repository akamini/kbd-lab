import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function NewsSection() {
  return (
    <section className='w-full py-16 px-4 bg-gray-50'>
      <div className='container mx-auto max-w-6xl'>
        <h2 className='text-3xl font-bold mb-12'>新着情報</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* 新着アイテムのプレースホルダー */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card
              key={item}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              <div className='relative w-full h-48 bg-gray-200'>
                {/* 画像プレースホルダー */}
                <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                  <span>画像準備中</span>
                </div>
              </div>
              <CardHeader className='p-4'>
                <CardTitle className='text-lg'>新着キーボード {item}</CardTitle>
                <CardDescription>投稿者: ユーザー{item}</CardDescription>
              </CardHeader>
              <CardFooter className='p-4 pt-0 flex justify-between'>
                <span className='text-sm text-gray-500'>
                  2023/06/{10 + item}
                </span>
                <Button variant='ghost' size='sm' className='text-[#61dafb]'>
                  詳細を見る
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className='mt-8 text-center'>
          <Button
            variant='outline'
            className='border-[#61dafb] text-[#61dafb] hover:bg-[#61dafb] hover:text-white'
          >
            もっと見る
          </Button>
        </div>
      </div>
    </section>
  );
}
