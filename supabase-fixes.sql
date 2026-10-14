-- ============================================================
-- Panchaloham — fixes + seed data
-- File: supabase-fixes.sql
-- Run AFTER supabase.sql has been run successfully.
-- Paste all of this into a New query in the Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- FIX 1. Make price optional so a piece can show "Price to be confirmed"
--        (PRD: if a product has no price yet, show 'Price to be confirmed')
-- ============================================================
alter table public.products alter column price drop not null;
alter table public.products alter column price drop default;

-- ============================================================
-- FIX 2. Flag products that should appear in the Best Sellers slider
-- ============================================================
alter table public.products add column if not exists is_best_seller boolean not null default false;


-- ============================================================
-- Seed the 6 categories (safe to re-run)
-- ============================================================
insert into public.categories (name, slug, sort_order) values
  ('Panchaloham Jewellery',     'panchaloham-jewellery',     1),
  ('One Gram Gold Collections', 'one-gram-gold-collections', 2),
  ('Imitation Jewellery',       'imitation-jewellery',       3),
  ('GJ Jewellery',              'gj-jewellery',              4),
  ('Gold Covering Jewellery',   'gold-covering-jewellery',   5),
  ('Beads Jewellery',           'beads-jewellery',           6)
on conflict (slug) do nothing;


-- ============================================================
-- Products: TEMPLATE ONLY
-- Do NOT run this until you paste your real product list.
-- Replace <name>, <code>, <slug>, <price or NULL>, <stock>, <photo url>.
-- Price may be NULL -> the website shows "Price to be confirmed".
-- ============================================================
-- insert into public.products (name, code, category_id, price, stock, photo_urls, is_best_seller)
-- values
--   ('<name>', '<code>', (select id from public.categories where slug = '<slug>'), <price or NULL>, <stock>, '{<photo url>}', false);
