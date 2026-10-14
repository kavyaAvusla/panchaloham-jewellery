-- ============================================================
-- Panchaloham — products (real data from the sheet)
-- File: supabase-products.sql
-- Run AFTER supabase.sql and supabase-fixes.sql.
--
-- Ear tops  -> category: Panchaloham Jewellery (Panchaloham), price 400, stock 6
-- CZ cuffs  -> category: Imitation Jewellery (price still to be confirmed)
-- ============================================================

-- Clean up any earlier test rows with the old code format (safe if none exist)
delete from public.products where code like 'PET011-%';

-- Pure Panchaloham ear tops (PET001 - PET011)
insert into public.products (name, code, category_id, price, stock, photo_urls, is_best_seller)
values
  ('Pure Panchaloham ear tops', 'PET001', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET001.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET002', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET002.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET003', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET003.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET004', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET004.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET005', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET005.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET006', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET006.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET007', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET007.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET008', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET008.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET009', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET009.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET010', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET010.jpg}', false),
  ('Pure Panchaloham ear tops', 'PET011', (select id from public.categories where slug = 'panchaloham-jewellery'), 400, 6, '{/images/products/PET011.jpg}', false)
on conflict (code) do nothing;

-- CZ Ear Cuffs (category: Imitation Jewellery)
-- Price/stock: To be confirmed -> NULL price shows "Price to be confirmed".
insert into public.products (name, code, category_id, price, stock, photo_urls, is_best_seller)
values
  ('CZ Ear Cuffs', 'CZEC-1', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-1.jpg}', false),
  ('CZ Ear Cuffs', 'CZEC-2', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-2.jpg}', false),
  ('CZ Ear Cuffs', 'CZEC-3', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-3.jpg}', false),
  ('CZ Ear Cuffs', 'CZEC-4', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-4.jpg}', false),
  ('CZ Ear Cuffs', 'CZEC-5', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-5.jpg}', false),
  ('CZ Ear Cuffs', 'CZEC-6', (select id from public.categories where slug = 'imitation-jewellery'), NULL, 0, '{/images/products/cz-ear-cuffs-6.jpg}', false)
on conflict (code) do nothing;

-- If you already ran an earlier version, run these to clear the Best Sellers flag:
update public.products set is_best_seller = false where code like 'CZEC-%';
update public.products set is_best_seller = false where code like 'PET011-%';
