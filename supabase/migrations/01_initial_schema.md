# Supabase データベース設計と RLS ポリシー設定

## テーブル設計

```sql
-- ユーザープロフィールテーブル（auth.usersの拡張）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- カテゴリテーブル
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- タグテーブル
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- プロダクトテーブル（キーボード、キーキャップ、小物共通）
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES public.categories(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  github_url TEXT,
  shop_url TEXT,
  images TEXT[] DEFAULT '{}'::TEXT[],
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- プロダクト-タグ中間テーブル
CREATE TABLE public.product_tags (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- お気に入りテーブル
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- インデックス設定
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);
CREATE INDEX idx_product_tags_product_id ON public.product_tags(product_id);
CREATE INDEX idx_product_tags_tag_id ON public.product_tags(tag_id);
```

## RLS ポリシー設定

```sql
-- テーブルのRLSを有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- プロフィールテーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "プロフィールは誰でも閲覧可能" ON public.profiles
  FOR SELECT USING (true);

-- 自分のプロフィールのみ編集可能
CREATE POLICY "自分のプロフィールのみ編集可能" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 自分のプロフィールのみ作成可能
CREATE POLICY "自分のプロフィールのみ作成可能" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- カテゴリテーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "カテゴリは誰でも閲覧可能" ON public.categories
  FOR SELECT USING (true);

-- 管理者のみ作成・編集・削除可能
CREATE POLICY "カテゴリは管理者のみ作成可能" ON public.categories
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "カテゴリは管理者のみ編集可能" ON public.categories
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "カテゴリは管理者のみ削除可能" ON public.categories
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- タグテーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "タグは誰でも閲覧可能" ON public.tags
  FOR SELECT USING (true);

-- 管理者のみ作成・編集・削除可能
CREATE POLICY "タグは管理者のみ作成可能" ON public.tags
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "タグは管理者のみ編集可能" ON public.tags
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "タグは管理者のみ削除可能" ON public.tags
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- プロダクトテーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "プロダクトは誰でも閲覧可能" ON public.products
  FOR SELECT USING (true);

-- 自分のプロダクトのみ作成可能
CREATE POLICY "自分のプロダクトのみ作成可能" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のプロダクトまたは管理者のみ編集可能
CREATE POLICY "自分のプロダクトまたは管理者のみ編集可能" ON public.products
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- 自分のプロダクトまたは管理者のみ削除可能
CREATE POLICY "自分のプロダクトまたは管理者のみ削除可能" ON public.products
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- プロダクト-タグ中間テーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "プロダクトタグは誰でも閲覧可能" ON public.product_tags
  FOR SELECT USING (true);

-- 自分のプロダクトのタグのみ作成・編集・削除可能
CREATE POLICY "自分のプロダクトのタグのみ作成可能" ON public.product_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id AND products.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "自分のプロダクトのタグのみ削除可能" ON public.product_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_id AND products.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- お気に入りテーブルのポリシー
-- 自分のお気に入りのみ閲覧可能
CREATE POLICY "自分のお気に入りのみ閲覧可能" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 自分のお気に入りのみ作成可能
CREATE POLICY "自分のお気に入りのみ作成可能" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のお気に入りのみ削除可能
CREATE POLICY "自分のお気に入りのみ削除可能" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);
```

## Storage バケット設定と RLS ポリシー

```sql
-- プロダクト画像用のバケットを作成
INSERT INTO storage.buckets (id, name, public) VALUES ('product_images', 'product_images', true);

-- バケットのRLSポリシー設定
-- 画像の取得: 全てのユーザーに許可
CREATE POLICY "画像は誰でも閲覧可能" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product_images');

-- 画像の作成: 認証済みユーザーのみ、自分のフォルダにのみ可能
CREATE POLICY "自分のフォルダにのみ画像をアップロード可能" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product_images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 画像の更新・削除: 自分のフォルダの画像のみ可能
CREATE POLICY "自分のフォルダの画像のみ更新可能" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product_images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "自分のフォルダの画像のみ削除可能" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product_images' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## 初期データ投入

```sql
-- カテゴリの初期データ
INSERT INTO public.categories (name, slug, description) VALUES
('キーボード', 'keyboards', '自作キーボードの作品'),
('キーキャップ', 'keycaps', 'カスタムキーキャップの作品'),
('小物', 'accessories', 'デスク周りの小物'),
('工具', 'tools', 'キーボード製作に役立つ工具');

-- よく使われるタグの初期データ
INSERT INTO public.tags (name, slug) VALUES
('自作キット', 'diy-kit'),
('3Dプリント', '3d-printed'),
('無線', 'wireless'),
('有線', 'wired'),
('分割型', 'split'),
('フルサイズ', 'full-size'),
('テンキーレス', 'tenkeyless'),
('60%', '60-percent'),
('40%', '40-percent');
```
