-- ============================================================
-- Panchaloham — Best Sellers products (from the best-sellers images)
-- File: supabase-best-sellers.sql
-- Run AFTER supabase.sql and supabase-fixes.sql.
--
-- These 11 rows are flagged is_best_seller = true, so they appear in the
-- Best Sellers section on the home page.
-- Price is NULL -> the site shows "Price to be confirmed".
-- Codes BS01..BS11 are temporary until you give the real jewellery codes.
-- Categories are set only where the name clearly says so (GJ / Panchaloham).
-- ============================================================

insert into public.products (name, code, category_id, price, stock, photo_urls, is_best_seller)
values
  ('Premium Bugadi',                'BS01', null, null, 0, '{/images/best-sellers/bs-01.jpg}', true),
  ('Premium Bugadi',                'BS02', null, null, 0, '{/images/best-sellers/bs-02.jpg}', true),
  ('Premium Bugadi',                'BS03', null, null, 0, '{/images/best-sellers/bs-03.jpg}', true),
  ('Premium GJ Jewel',              'BS04', (select id from public.categories where slug = 'gj-jewellery'), null, 0, '{/images/best-sellers/bs-04.jpg}', true),
  ('Premium Victorian Collection',  'BS05', null, null, 0, '{/images/best-sellers/bs-05.jpg}', true),
  ('Premium Victorian Collection',  'BS06', null, null, 0, '{/images/best-sellers/bs-06.jpg}', true),
  ('Premium Victorian Collection',  'BS07', null, null, 0, '{/images/best-sellers/bs-07.jpg}', true),
  ('Premium Victorian Collection',  'BS08', null, null, 0, '{/images/best-sellers/bs-08.jpg}', true),
  ('Premium White GJ Jewel',        'BS09', (select id from public.categories where slug = 'gj-jewellery'), null, 0, '{/images/best-sellers/bs-09.jpg}', true),
  ('Pure Panchaloham Bangles',      'BS10', (select id from public.categories where slug = 'panchaloham-jewellery'), null, 0, '{/images/best-sellers/bs-10.jpg}', true),
  ('Bangles',                       'BS11', null, null, 0, '{/images/best-sellers/bs-11.jpg}', true)
on conflict (code) do nothing;
