import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function FeaturedProductsSection() {
  return (
    <section className='w-full py-16 px-4 bg-white'>
      <div className='container mx-auto max-w-6xl'>
        <h2 className='text-3xl font-bold mb-12'>おすすめプロダクト</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* フィーチャーアイテム */}
          <Card className='flex flex-col md:flex-row overflow-hidden'>
            <div className='relative w-full md:w-2/5 h-48 md:h-auto bg-gray-200'>
              {/* 画像プレースホルダー */}
              <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                <span>画像準備中</span>
              </div>
            </div>
            <div className='flex-1 p-6'>
              <CardTitle className='mb-2'>おすすめキーボード 1</CardTitle>
              <CardDescription className='mb-4'>
                60%コンパクトメカニカルキーボード
              </CardDescription>
              <p className='text-sm text-gray-600 mb-4'>
                高品質なアルミニウムケースと静音スイッチを採用した、デスク環境にマッチするコンパクトキーボード。
              </p>
              <Button className='bg-[#61dafb] hover:bg-[#4db8e0] text-white mt-auto'>
                詳細を見る
              </Button>
            </div>
          </Card>
          <Card className='flex flex-col md:flex-row overflow-hidden'>
            <div className='relative w-full md:w-2/5 h-48 md:h-auto bg-gray-200'>
              {/* 画像プレースホルダー */}
              <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                <span>画像準備中</span>
              </div>
            </div>
            <div className='flex-1 p-6'>
              <CardTitle className='mb-2'>おすすめキーキャップセット</CardTitle>
              <CardDescription className='mb-4'>
                PBTダイサブキーキャップ
              </CardDescription>
              <p className='text-sm text-gray-600 mb-4'>
                耐久性に優れたPBT素材を使用し、長期間の使用でも色あせしにくいプレミアムキーキャップセット。
              </p>
              <Button className='bg-[#61dafb] hover:bg-[#4db8e0] text-white mt-auto'>
                詳細を見る
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
