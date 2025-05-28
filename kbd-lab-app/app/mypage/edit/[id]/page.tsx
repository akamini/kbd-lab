'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category_id: number;
  github_url?: string;
  shop_url?: string;
  images: string[];
  user_id: string;
  product_tags: {
    tags: {
      id: number;
      name: string;
    };
  }[];
}

export default function EditProductPage() {
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/?login=true');
        return;
      }

      setUser(session.user);
      await Promise.all([
        fetchProduct(productId, session.user.id),
        fetchCategories(),
        fetchTags(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [router, productId]);

  const fetchProduct = async (id: string, userId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        product_tags(
          tags(id, name)
        )
      `
      )
      .eq('id', id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('商品の取得に失敗しました:', error);
      toast.error('商品が見つかりません');
      router.push('/mypage');
      return;
    }

    setProduct(data);
    setTitle(data.title);
    setDescription(data.description || '');
    setCategoryId(data.category_id.toString());
    setGithubUrl(data.github_url || '');
    setShopUrl(data.shop_url || '');
    setExistingImages(data.images || []);
    setSelectedTags(data.product_tags.map((pt: any) => pt.tags));
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('カテゴリの取得に失敗しました:', error);
      return;
    }

    setCategories(data || []);
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('タグの取得に失敗しました:', error);
      return;
    }

    setTags(data || []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 5) {
      toast.error('画像は最大5枚まで選択できます');
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // プレビュー用のURL生成
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const createNewTag = async () => {
    if (!newTag.trim()) return;

    // 既存のタグ名と重複チェック
    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTag.trim().toLowerCase()
    );
    if (existingTag) {
      addTag(existingTag);
      setNewTag('');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ name: newTag.trim() })
        .select()
        .single();

      if (error) {
        console.error('タグ作成エラー:', error);
        toast.error('タグの作成に失敗しました');
        return;
      }

      const newTagData = data as Tag;
      setTags((prev) => [...prev, newTagData]);
      addTag(newTagData);
      setNewTag('');
      toast.success(`タグ「${newTagData.name}」を作成しました`);
    } catch (error) {
      console.error('タグ作成エラー:', error);
      toast.error('タグの作成に失敗しました');
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(fileName, image);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('product_images').getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('画像のアップロードに失敗しました:', error);
      throw error;
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !categoryId) {
      toast.error('必須項目を入力してください');
      return;
    }

    setSaving(true);

    try {
      // 新しい画像をアップロード
      const newImageUrls = await uploadImages();
      const allImages = [...existingImages, ...newImageUrls];

      // プロダクトを更新
      const { error: productError } = await supabase
        .from('products')
        .update({
          title: title.trim(),
          description: description.trim(),
          category_id: parseInt(categoryId),
          github_url: githubUrl.trim() || null,
          shop_url: shopUrl.trim() || null,
          images: allImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (productError) {
        throw productError;
      }

      // 既存のタグ関連付けを削除
      const { error: deleteTagError } = await supabase
        .from('product_tags')
        .delete()
        .eq('product_id', productId);

      if (deleteTagError) {
        throw deleteTagError;
      }

      // 新しいタグを関連付け
      if (selectedTags.length > 0) {
        const productTags = selectedTags.map((tag) => ({
          product_id: productId,
          tag_id: tag.id,
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(productTags);

        if (tagError) {
          throw tagError;
        }
      }

      toast.success('商品を更新しました');
      router.push('/mypage');
    } catch (error) {
      console.error('商品の更新に失敗しました:', error);
      toast.error('商品の更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当にこの商品を削除しますか？この操作は取り消せません。')) {
      return;
    }

    setDeleting(true);

    try {
      // DELETE操作（トリガーにより論理削除に変換される）
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      toast.success('商品を削除しました');
      router.push('/mypage');
    } catch (error) {
      console.error('商品の削除に失敗しました:', error);
      toast.error('商品の削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#61dafb] mx-auto mb-4'></div>
            <p className='text-gray-600'>読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>商品が見つかりません</p>
          <Link href='/mypage'>
            <Button variant='outline'>マイページに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <div className='mb-6'>
        <Link href='/mypage'>
          <Button variant='ghost' className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            マイページに戻る
          </Button>
        </Link>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>商品を編集</h1>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleting}
            className='flex items-center gap-2'
          >
            {deleting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4' />
            )}
            削除
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* タイトル */}
        <div className='space-y-2'>
          <Label htmlFor='title'>タイトル *</Label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='商品のタイトルを入力してください'
            required
          />
        </div>

        {/* 説明 */}
        <div className='space-y-2'>
          <Label htmlFor='description'>説明 *</Label>
          <Textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='商品の説明を入力してください'
            rows={4}
            required
          />
        </div>

        {/* カテゴリ */}
        <div className='space-y-2'>
          <Label htmlFor='category'>カテゴリ *</Label>
          <Select value={categoryId} onValueChange={setCategoryId} required>
            <SelectTrigger>
              <SelectValue placeholder='カテゴリを選択してください' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* GitHub URL */}
        <div className='space-y-2'>
          <Label htmlFor='github'>GitHub URL</Label>
          <Input
            id='github'
            type='url'
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder='https://github.com/username/repository'
          />
        </div>

        {/* ショップ URL */}
        <div className='space-y-2'>
          <Label htmlFor='shop'>ショップ URL</Label>
          <Input
            id='shop'
            type='url'
            value={shopUrl}
            onChange={(e) => setShopUrl(e.target.value)}
            placeholder='https://example.com/product'
          />
        </div>

        {/* タグ */}
        <div className='space-y-2'>
          <Label>タグ</Label>
          <div className='space-y-3'>
            {/* 選択済みタグ */}
            {selectedTags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {tag.name}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={() => removeTag(tag.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* 既存タグから選択 */}
            <Select
              onValueChange={(value) => {
                const tag = tags.find((t) => t.id === parseInt(value));
                if (tag) addTag(tag);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='既存のタグから選択' />
              </SelectTrigger>
              <SelectContent>
                {tags
                  .filter((tag) => !selectedTags.find((st) => st.id === tag.id))
                  .map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      {tag.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* 新しいタグを作成 */}
            <div className='flex gap-2'>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder='新しいタグを入力'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    createNewTag();
                  }
                }}
              />
              <Button
                type='button'
                variant='outline'
                onClick={createNewTag}
                disabled={!newTag.trim()}
              >
                追加
              </Button>
            </div>
          </div>
        </div>

        {/* 画像 */}
        <div className='space-y-2'>
          <Label>画像（最大5枚）</Label>
          <div className='space-y-4'>
            {/* 既存画像 */}
            {existingImages.length > 0 && (
              <div>
                <p className='text-sm text-gray-600 mb-2'>現在の画像:</p>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                  {existingImages.map((url, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={url}
                        alt={`商品画像 ${index + 1}`}
                        className='w-full h-24 object-cover rounded border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                        onClick={() => removeExistingImage(index)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新しい画像プレビュー */}
            {imagePreviews.length > 0 && (
              <div>
                <p className='text-sm text-gray-600 mb-2'>新しい画像:</p>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={preview}
                        alt={`新しい画像 ${index + 1}`}
                        className='w-full h-24 object-cover rounded border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                        onClick={() => removeNewImage(index)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 画像アップロード */}
            {existingImages.length + images.length < 5 && (
              <div>
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleImageChange}
                  className='hidden'
                  id='image-upload'
                />
                <label htmlFor='image-upload'>
                  <Card className='border-dashed border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-colors'>
                    <CardContent className='flex flex-col items-center justify-center py-8'>
                      <Upload className='h-8 w-8 text-gray-400 mb-2' />
                      <p className='text-sm text-gray-600'>
                        クリックして画像を選択
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        残り{5 - existingImages.length - images.length}
                        枚まで追加可能
                      </p>
                    </CardContent>
                  </Card>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className='flex gap-4'>
          <Button
            type='submit'
            disabled={saving || uploading}
            className='bg-[#61dafb] hover:bg-[#4db8e0] flex-1'
          >
            {saving || uploading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
                {uploading ? '画像をアップロード中...' : '更新中...'}
              </>
            ) : (
              '更新する'
            )}
          </Button>
          <Link href='/mypage'>
            <Button type='button' variant='outline'>
              キャンセル
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
