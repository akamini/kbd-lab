# ランキング機能用テーブル設計と RLS ポリシー設定

## テーブル設計

```sql
-- ランキング集計テーブル
CREATE TABLE public.product_rankings (
  id SERIAL PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  favorite_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  ranking_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
  ranking_date DATE NOT NULL,   -- 集計日
  rank INTEGER,                  -- 順位
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(product_id, ranking_period, ranking_date)
);

-- インデックス設定
CREATE INDEX idx_product_rankings_product_id ON public.product_rankings(product_id);
CREATE INDEX idx_product_rankings_period_date ON public.product_rankings(ranking_period, ranking_date);
CREATE INDEX idx_product_rankings_rank ON public.product_rankings(rank);
```

## RLS ポリシー設定

```sql
-- テーブルのRLSを有効化
ALTER TABLE public.product_rankings ENABLE ROW LEVEL SECURITY;

-- ランキングテーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "ランキングは誰でも閲覧可能" ON public.product_rankings
  FOR SELECT USING (true);

-- 管理者のみ作成・編集・削除可能
CREATE POLICY "ランキングは管理者のみ作成可能" ON public.product_rankings
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "ランキングは管理者のみ編集可能" ON public.product_rankings
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "ランキングは管理者のみ削除可能" ON public.product_rankings
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));
```

## ランキング集計用関数

```sql
-- 日次ランキング集計関数
CREATE OR REPLACE FUNCTION update_daily_rankings()
RETURNS void AS $$
DECLARE
  target_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- 既存のデータを削除
  DELETE FROM public.product_rankings
  WHERE ranking_period = 'daily' AND ranking_date = target_date;

  -- 新しいランキングデータを挿入
  INSERT INTO public.product_rankings
    (product_id, favorite_count, view_count, ranking_period, ranking_date, rank)
  SELECT
    p.id,
    COUNT(f.id) AS favorite_count,
    p.view_count,
    'daily',
    target_date,
    ROW_NUMBER() OVER (ORDER BY COUNT(f.id) DESC, p.view_count DESC)
  FROM
    public.products p
  LEFT JOIN
    public.favorites f ON p.id = f.product_id
  WHERE
    (f.created_at >= target_date AND f.created_at < target_date + INTERVAL '1 day')
    OR f.id IS NULL
  GROUP BY
    p.id
  ORDER BY
    favorite_count DESC, view_count DESC
  LIMIT 100;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 週次ランキング集計関数
CREATE OR REPLACE FUNCTION update_weekly_rankings()
RETURNS void AS $$
DECLARE
  end_date DATE := CURRENT_DATE - INTERVAL '1 day';
  start_date DATE := end_date - INTERVAL '6 days';
BEGIN
  -- 既存のデータを削除
  DELETE FROM public.product_rankings
  WHERE ranking_period = 'weekly' AND ranking_date = end_date;

  -- 新しいランキングデータを挿入
  INSERT INTO public.product_rankings
    (product_id, favorite_count, view_count, ranking_period, ranking_date, rank)
  SELECT
    p.id,
    COUNT(f.id) AS favorite_count,
    p.view_count,
    'weekly',
    end_date,
    ROW_NUMBER() OVER (ORDER BY COUNT(f.id) DESC, p.view_count DESC)
  FROM
    public.products p
  LEFT JOIN
    public.favorites f ON p.id = f.product_id
  WHERE
    (f.created_at >= start_date AND f.created_at < end_date + INTERVAL '1 day')
    OR f.id IS NULL
  GROUP BY
    p.id
  ORDER BY
    favorite_count DESC, view_count DESC
  LIMIT 100;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 月次ランキング集計関数
CREATE OR REPLACE FUNCTION update_monthly_rankings()
RETURNS void AS $$
DECLARE
  end_date DATE := CURRENT_DATE - INTERVAL '1 day';
  start_date DATE := DATE_TRUNC('month', end_date)::DATE;
BEGIN
  -- 既存のデータを削除
  DELETE FROM public.product_rankings
  WHERE ranking_period = 'monthly' AND ranking_date = end_date;

  -- 新しいランキングデータを挿入
  INSERT INTO public.product_rankings
    (product_id, favorite_count, view_count, ranking_period, ranking_date, rank)
  SELECT
    p.id,
    COUNT(f.id) AS favorite_count,
    p.view_count,
    'monthly',
    end_date,
    ROW_NUMBER() OVER (ORDER BY COUNT(f.id) DESC, p.view_count DESC)
  FROM
    public.products p
  LEFT JOIN
    public.favorites f ON p.id = f.product_id
  WHERE
    (f.created_at >= start_date AND f.created_at < end_date + INTERVAL '1 day')
    OR f.id IS NULL
  GROUP BY
    p.id
  ORDER BY
    favorite_count DESC, view_count DESC
  LIMIT 100;

  RETURN;
END;
$$ LANGUAGE plpgsql;
```

## 定期実行設定

```sql
-- 定期実行のためのcron拡張を有効化（管理者権限が必要）
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 日次ランキング更新ジョブ（毎日午前1時に実行）
-- SELECT cron.schedule('0 1 * * *', 'SELECT update_daily_rankings();');

-- 週次ランキング更新ジョブ（毎週月曜日の午前2時に実行）
-- SELECT cron.schedule('0 2 * * 1', 'SELECT update_weekly_rankings();');

-- 月次ランキング更新ジョブ（毎月1日の午前3時に実行）
-- SELECT cron.schedule('0 3 1 * *', 'SELECT update_monthly_rankings();');
```

注意: pg_cron 拡張の有効化と cron ジョブの設定は、Supabase の設定によっては制限がある場合があります。必要に応じて、外部のスケジューラーサービスやバックエンド API からの定期実行を検討してください。
