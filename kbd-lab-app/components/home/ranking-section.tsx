import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function RankingSection() {
  return (
    <section className='w-full py-16 px-4 bg-gray-50'>
      <div className='container mx-auto max-w-6xl'>
        <h2 className='text-3xl font-bold mb-12'>人気ランキング</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* ランキングアイテム */}
          {[1, 2, 3].map((rank) => (
            <Card key={rank} className='relative overflow-hidden'>
              <div className='absolute top-0 left-0 w-12 h-12 flex items-center justify-center bg-[#61dafb] text-white font-bold text-xl z-10'>
                {rank}
              </div>
              <div className='relative w-full h-48 bg-gray-200'>
                {/* 画像プレースホルダー */}
                <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                  <span>画像準備中</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle>人気キーボード {rank}</CardTitle>
                <CardDescription>
                  お気に入り数: {100 - rank * 10}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className='w-full bg-[#61dafb] hover:bg-[#4db8e0] text-white'>
                  詳細を見る
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
