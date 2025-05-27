'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface PostFormProps {
  user: any;
}

export function PostForm({ user }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState('');
  const [shopUrl, setShopUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

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
    if (files.length + images.length > 5) {
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

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

    setLoading(true);

    try {
      // 画像をアップロード
      const imageUrls = await uploadImages();

      // プロダクトを作成
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: title.trim(),
          description: description.trim(),
          category_id: parseInt(categoryId),
          user_id: user.id,
          github_url: githubUrl.trim() || null,
          shop_url: shopUrl.trim() || null,
          images: imageUrls,
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      // タグを関連付け
      if (selectedTags.length > 0) {
        const productTags = selectedTags.map((tag) => ({
          product_id: product.id,
          tag_id: tag.id,
        }));

        const { error: tagError } = await supabase
          .from('product_tags')
          .insert(productTags);

        if (tagError) {
          console.error('タグの関連付けに失敗しました:', tagError);
        }
      }

      toast.success('プロダクトを投稿しました！');
      router.push('/');
    } catch (error) {
      console.error('投稿に失敗しました:', error);
      toast.error('投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* タイトル */}
      <div className='space-y-2'>
        <Label htmlFor='title'>タイトル *</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='プロダクトのタイトルを入力'
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
          placeholder='プロダクトの詳細な説明を入力'
          rows={4}
          required
        />
      </div>

      {/* カテゴリ */}
      <div className='space-y-2'>
        <Label htmlFor='category'>カテゴリ *</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder='カテゴリを選択' />
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
        <div className='space-y-2'>
          <Select
            onValueChange={(value) => {
              const tag = tags.find((t) => t.id.toString() === value);
              if (tag) addTag(tag);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='タグを選択' />
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

          <div className='flex gap-2'>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder='新しいタグを作成'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  createNewTag();
                }
              }}
            />
            <Button type='button' onClick={createNewTag} variant='outline'>
              追加
            </Button>
          </div>

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
        </div>
      </div>

      {/* 画像アップロード */}
      <div className='space-y-2'>
        <Label>画像 (最大5枚)</Label>
        <div className='space-y-4'>
          <div className='flex items-center justify-center w-full'>
            <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Upload className='w-8 h-8 mb-4 text-gray-500' />
                <p className='mb-2 text-sm text-gray-500'>
                  <span className='font-semibold'>クリックして画像を選択</span>
                </p>
                <p className='text-xs text-gray-500'>
                  PNG, JPG, GIF (最大10MB)
                </p>
              </div>
              <input
                type='file'
                className='hidden'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                disabled={images.length >= 5}
              />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {imagePreviews.map((preview, index) => (
                <Card key={index} className='relative'>
                  <CardContent className='p-2'>
                    <img
                      src={preview}
                      alt={`プレビュー ${index + 1}`}
                      className='w-full h-32 object-cover rounded'
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      className='absolute top-1 right-1'
                      onClick={() => removeImage(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 送信ボタン */}
      <div className='flex justify-end space-x-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.back()}
          disabled={loading || uploading}
        >
          キャンセル
        </Button>
        <Button
          type='submit'
          disabled={loading || uploading}
          className='bg-[#61dafb] hover:bg-[#4db8e0]'
        >
          {loading || uploading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {uploading ? 'アップロード中...' : '投稿中...'}
            </>
          ) : (
            '投稿する'
          )}
        </Button>
      </div>
    </form>
  );
}
