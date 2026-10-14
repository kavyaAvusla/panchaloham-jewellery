-- ============================================================
-- Panchaloham — Beads Jewellery products + Panchaloham category banner
-- File: supabase-beads.sql
-- Run AFTER supabase.sql and supabase-fixes.sql.
--
-- 47 beads images -> category: Beads Jewellery
-- Price is NULL -> the site shows "Price to be confirmed".
-- Codes BJ47..BJ93 are temporary until you give the real codes.
-- ============================================================

insert into public.products (name, code, category_id, price, stock, photo_urls, is_best_seller)
values
  ('Beads Jewellery', 'BJ47', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-47.jpg}', false),
  ('Beads Jewellery', 'BJ48', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-48.jpg}', false),
  ('Beads Jewellery', 'BJ49', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-49.jpg}', false),
  ('Beads Jewellery', 'BJ50', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-50.jpg}', false),
  ('Beads Jewellery', 'BJ51', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-51.jpg}', false),
  ('Beads Jewellery', 'BJ52', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-52.jpg}', false),
  ('Beads Jewellery', 'BJ53', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-53.jpg}', false),
  ('Beads Jewellery', 'BJ54', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-54.jpg}', false),
  ('Beads Jewellery', 'BJ55', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-55.jpg}', false),
  ('Beads Jewellery', 'BJ56', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-56.jpg}', false),
  ('Beads Jewellery', 'BJ57', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-57.jpg}', false),
  ('Beads Jewellery', 'BJ58', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-58.jpg}', false),
  ('Beads Jewellery', 'BJ59', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-59.jpg}', false),
  ('Beads Jewellery', 'BJ60', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-60.jpg}', false),
  ('Beads Jewellery', 'BJ61', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-61.jpg}', false),
  ('Beads Jewellery', 'BJ62', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-62.jpg}', false),
  ('Beads Jewellery', 'BJ63', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-63.jpg}', false),
  ('Beads Jewellery', 'BJ64', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-64.jpg}', false),
  ('Beads Jewellery', 'BJ65', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-65.jpg}', false),
  ('Beads Jewellery', 'BJ66', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-66.jpg}', false),
  ('Beads Jewellery', 'BJ67', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-67.jpg}', false),
  ('Beads Jewellery', 'BJ68', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-68.jpg}', false),
  ('Beads Jewellery', 'BJ69', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-69.jpg}', false),
  ('Beads Jewellery', 'BJ70', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-70.jpg}', false),
  ('Beads Jewellery', 'BJ71', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-71.jpg}', false),
  ('Beads Jewellery', 'BJ72', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-72.jpg}', false),
  ('Beads Jewellery', 'BJ73', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-73.jpg}', false),
  ('Beads Jewellery', 'BJ74', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-74.jpg}', false),
  ('Beads Jewellery', 'BJ75', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-75.jpg}', false),
  ('Beads Jewellery', 'BJ76', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-76.jpg}', false),
  ('Beads Jewellery', 'BJ77', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-77.jpg}', false),
  ('Beads Jewellery', 'BJ78', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-78.jpg}', false),
  ('Beads Jewellery', 'BJ79', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-79.jpg}', false),
  ('Beads Jewellery', 'BJ80', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-80.jpg}', false),
  ('Beads Jewellery', 'BJ81', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-81.jpg}', false),
  ('Beads Jewellery', 'BJ82', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-82.jpg}', false),
  ('Beads Jewellery', 'BJ83', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-83.jpg}', false),
  ('Beads Jewellery', 'BJ84', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-84.jpg}', false),
  ('Beads Jewellery', 'BJ85', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-85.jpg}', false),
  ('Beads Jewellery', 'BJ86', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-86.jpg}', false),
  ('Beads Jewellery', 'BJ87', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-87.jpg}', false),
  ('Beads Jewellery', 'BJ88', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-88.jpg}', false),
  ('Beads Jewellery', 'BJ89', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-89.jpg}', false),
  ('Beads Jewellery', 'BJ90', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-90.jpg}', false),
  ('Beads Jewellery', 'BJ91', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-91.jpg}', false),
  ('Beads Jewellery', 'BJ92', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-92.jpg}', false),
  ('Beads Jewellery', 'BJ93', (select id from public.categories where slug = 'beads-jewellery'), null, 0, '{/images/products/beads-93.jpg}', false)
on conflict (code) do nothing;

-- Panchaloham Jewellery category banner image (used on the category card + page banner)
update public.categories
  set photo_url = '/images/categories/panchaloham-banner.jpg'
  where slug = 'panchaloham-jewellery';

-- Beads Jewellery category banner image
update public.categories
  set photo_url = '/images/categories/beads-jewellery-banner.jpg'
  where slug = 'beads-jewellery';
