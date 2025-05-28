'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Github, Plus, Edit } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  github_url?: string;
  shop_url?: string;
  created_at: string;
  categories: {
    name: string;
  };
  product_tags: {
    tags: {
      name: string;
    };
  }[];
}

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'favorites'>('posts');

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/?login=true');
        return;
      }

      setUser(session.user);
      const [myProductsData] = await Promise.all([
        fetchMyProducts(session.user.id),
        fetchFavoriteProducts(session.user.id),
      ]);
      setMyProducts(myProductsData);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const fetchMyProducts = async (userId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories(name),
        product_tags(
          tags(id, name)
        )
      `
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('商品の取得に失敗しました:', error);
      return [];
    }

    return data || [];
  };

  const fetchFavoriteProducts = async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        products(
          *,
          categories(name),
          product_tags(
            tags(name)
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('お気に入り商品の取得に失敗しました:', error);
      return;
    }

    // 型安全な方法でデータを変換
    const favorites =
      data
        ?.map((item: any) => item.products)
        .filter((product: any) => product !== null) || [];
    setFavoriteProducts(favorites);
  };

  const removeFavorite = async (productId: number) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('お気に入りの削除に失敗しました:', error);
      return;
    }

    setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const ProductCard = ({
    product,
    showRemoveFavorite = false,
    showEdit = false,
  }: {
    product: Product;
    showRemoveFavorite?: boolean;
    showEdit?: boolean;
  }) => (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col'>
      <div className='aspect-video relative bg-gray-100'>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400'>
            画像なし
          </div>
        )}
      </div>
      <CardContent className='p-4 flex flex-col flex-1'>
        <div className='flex items-start justify-between mb-2'>
          <h3 className='font-semibold text-lg line-clamp-1'>
            {product.title}
          </h3>
          {showRemoveFavorite && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => removeFavorite(product.id)}
              className='text-red-500 hover:text-red-700 hover:bg-red-50'
            >
              <Heart className='h-4 w-4 fill-current' />
            </Button>
          )}
        </div>
        <p className='text-gray-600 text-sm mb-3 line-clamp-2 flex-1'>
          {product.description}
        </p>

        <div className='flex items-center gap-2 mb-3'>
          <Badge variant='secondary'>{product.categories.name}</Badge>
          {product.product_tags.slice(0, 2).map((pt, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
              {pt.tags.name}
            </Badge>
          ))}
          {product.product_tags.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{product.product_tags.length - 2}
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-2 mb-3'>
          {product.github_url && (
            <Link
              href={product.github_url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1'
              >
                <Github className='h-3 w-3' />
                GitHub
              </Button>
            </Link>
          )}
          {product.shop_url && (
            <Link
              href={product.shop_url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1'
              >
                <ExternalLink className='h-3 w-3' />
                ショップ
              </Button>
            </Link>
          )}
        </div>

        <div className='flex items-center justify-between mt-auto'>
          <div className='text-xs text-gray-500'>
            {new Date(product.created_at).toLocaleDateString('ja-JP')}
          </div>
          {showEdit && (
            <Button
              size='sm'
              variant='ghost'
              asChild
              className='text-[#61dafb] hover:text-[#4db8e0]'
            >
              <Link href={`/mypage/edit/${product.id}`}>
                <Edit className='h-4 w-4 mr-1' />
                編集
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#61dafb] mx-auto mb-4'></div>
            <p className='text-gray-600'>読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>マイページ</h1>
        <p className='text-gray-600'>
          こんにちは、{user?.user_metadata?.user_name || user?.email}さん
        </p>
      </div>

      {/* タブ */}
      <div className='flex border-b border-gray-200 mb-6'>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-[#61dafb] text-[#61dafb]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          投稿した商品 ({myProducts.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'favorites'
              ? 'border-[#61dafb] text-[#61dafb]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          お気に入り ({favoriteProducts.length})
        </button>
      </div>

      {/* コンテンツ */}
      {activeTab === 'posts' ? (
        <div>
          {myProducts.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 mb-4'>まだ商品を投稿していません</p>
              <Link href='/post'>
                <Button className='bg-[#61dafb] hover:bg-[#4db8e0]'>
                  最初の商品を投稿する
                </Button>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {myProducts.map((product) => (
                <ProductCard key={product.id} product={product} showEdit />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 mb-4'>お気に入りの商品がありません</p>
              <Link href='/'>
                <Button variant='outline'>商品を探す</Button>
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRemoveFavorite
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
