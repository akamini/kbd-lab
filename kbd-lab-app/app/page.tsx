import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center'>
      {/* ヒーローセクション */}
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
            <div className='pt-4 flex flex-wrap gap-4'>
              <Button
                asChild
                size='lg'
                className='bg-[#61dafb] hover:bg-[#4db8e0] text-white'
              >
                <Link href='/products'>製品を探す</Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/auth/login'>ログイン / 登録</Link>
              </Button>
            </div>
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

      {/* サイト概要セクション */}
      <section className='w-full py-16 px-4 bg-white'>
        <div className='container mx-auto max-w-6xl'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            KBD Lab について
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='border-t-4 border-t-[#61dafb]'>
              <CardHeader>
                <CardTitle>キーボードカタログ</CardTitle>
                <CardDescription>
                  様々な自作キーボードを閲覧できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  自作キーボード愛好家が投稿した様々なキーボードを閲覧できます。お気に入りの一品を見つけましょう。
                </p>
              </CardContent>
            </Card>
            <Card className='border-t-4 border-t-[#61dafb]'>
              <CardHeader>
                <CardTitle>キーキャップ・小物</CardTitle>
                <CardDescription>キーボード関連アイテムも充実</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  キーキャップや小物など、キーボード関連アイテムも多数掲載。あなたのキーボードをカスタマイズしましょう。
                </p>
              </CardContent>
            </Card>
            <Card className='border-t-4 border-t-[#61dafb]'>
              <CardHeader>
                <CardTitle>コミュニティ</CardTitle>
                <CardDescription>
                  自作キーボード愛好家のコミュニティ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  自作キーボード愛好家が集まるコミュニティ。あなたの作品を共有したり、他の人の作品からインスピレーションを得ましょう。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 新着情報セクション */}
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
                  <CardTitle className='text-lg'>
                    新着キーボード {item}
                  </CardTitle>
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

      {/* おすすめプロダクトセクション */}
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
                <CardTitle className='mb-2'>
                  おすすめキーキャップセット
                </CardTitle>
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

      {/* ランキングセクション */}
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

      {/* フッター */}
      <footer className='w-full py-12 px-4 bg-gray-900 text-white'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>KBD Lab</h3>
              <p className='text-gray-400'>
                自作キーボード愛好家のためのカタログサイト
              </p>
            </div>
            <div>
              <h4 className='font-bold mb-4'>カテゴリ</h4>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='/products/keyboards'
                    className='text-gray-400 hover:text-white'
                  >
                    キーボード
                  </Link>
                </li>
                <li>
                  <Link
                    href='/products/keycaps'
                    className='text-gray-400 hover:text-white'
                  >
                    キーキャップ
                  </Link>
                </li>
                <li>
                  <Link
                    href='/products/accessories'
                    className='text-gray-400 hover:text-white'
                  >
                    小物・アクセサリー
                  </Link>
                </li>
                <li>
                  <Link
                    href='/products/tools'
                    className='text-gray-400 hover:text-white'
                  >
                    工具
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-gray-800 text-center text-gray-500'>
            <p>© 2025 KBD Lab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
