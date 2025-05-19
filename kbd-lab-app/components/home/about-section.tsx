import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AboutSection() {
  return (
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
  );
}
