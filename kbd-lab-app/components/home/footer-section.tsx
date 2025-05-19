import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className='w-full py-10 px-4 bg-gray-900 text-white'>
      <div className='container mx-auto max-w-6xl'>
        <div className='flex flex-col md:flex-row md:justify-between gap-8'>
          <div className='md:max-w-s'>
            <h3 className='text-xl font-bold mb-3'>KBD Lab</h3>
            <p className='text-gray-400'>
              自作キーボード愛好家のためのカタログサイト
            </p>
          </div>
          <div>
            <h4 className='font-bold mb-3'>カテゴリ</h4>
            <ul className='grid grid-cols-2 gap-x-8 gap-y-2 md:flex md:space-x-6 md:space-y-0'>
              <li>
                <Link
                  href='/products/keyboards'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  キーボード
                </Link>
              </li>
              <li>
                <Link
                  href='/products/keycaps'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  キーキャップ
                </Link>
              </li>
              <li>
                <Link
                  href='/products/accessories'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  小物
                </Link>
              </li>
              <li>
                <Link
                  href='/products/tools'
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  工具
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-6 pt-6 border-t border-gray-800 text-center text-gray-500'>
          <p>© 2025 KBD Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
