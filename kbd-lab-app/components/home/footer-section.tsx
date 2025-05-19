import Link from 'next/link';

export function FooterSection() {
  return (
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
  );
}
