-- ============================================================
-- Panchaloham Jewellery — Supabase database setup
-- File: supabase.sql
-- What this does: creates all tables, keys, relations,
-- Row Level Security (RLS) rules, and a product photo bucket.
-- Run it ONCE in the Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- STEP 1. Extensions (needed for UUIDs and fast name search)
-- ============================================================
create extension if not exists pgcrypto;     -- gen_random_uuid()
create extension if not exists pg_trgm;      -- fast "looks like" name search


-- ============================================================
-- STEP 2. Tables
-- ============================================================

-- Users: one row per Supabase Auth user (customer or admin)
create table if not exists public.users (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  phone          text,
  email          text,
  role           text not null default 'customer' check (role in ('customer','admin')),
  offers_opt_in  boolean not null default false,   -- "I want to get offers" tick box
  language       text default 'en',
  created_at     timestamptz not null default now()
);

-- Categories: the 6 jewellery categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  photo_url   text,
  sort_order  int not null default 0,
  is_hidden   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  code          text unique not null,               -- jewellery code
  category_id   uuid references public.categories(id) on delete set null,
  type          text,                               -- Necklace, Earrings, Bangles, Rings, Pendants
  occasion      text,                               -- Bridal, Festival, Everyday
  metal         text,
  price         numeric(12,2) not null default 0,   -- in Rupees
  stock         int not null default 0,
  description   text,
  size_options  text[] default '{}',
  photo_urls    text[] default '{}',                -- Supabase Storage URLs
  is_hidden     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Addresses: saved delivery addresses
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  full_name   text not null,
  phone       text not null,
  line1       text not null,
  line2       text,
  city        text,
  state       text,
  pincode     text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  status           text not null default 'placed'
                     check (status in ('placed','packed','shipped','delivered','cancelled')),
  subtotal         numeric(12,2) not null default 0,
  delivery_charge  numeric(12,2) not null default 0,
  total            numeric(12,2) not null default 0,
  payment_status   text not null default 'pending'
                     check (payment_status in ('pending','paid','failed','refunded')),
  pincode          text,
  address_id       uuid references public.addresses(id) on delete set null,
  created_at       timestamptz not null default now()
);

-- Order Items
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  product_name  text not null,                       -- snapshot at time of order
  product_code  text,
  unit_price    numeric(12,2) not null default 0,
  quantity      int not null default 1 check (quantity > 0),
  line_total    numeric(12,2) not null default 0
);

-- Payments (NO card data stored)
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  gateway      text,
  gateway_ref  text,
  method       text check (method in ('upi','card','netbanking','other')),
  amount       numeric(12,2) not null default 0,
  status       text not null default 'pending' check (status in ('pending','success','failed')),
  created_at   timestamptz not null default now()
);

-- Reviews (with photos)
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  rating       int not null check (rating between 1 and 5),
  review_text  text,
  photo_urls   text[] default '{}',
  is_approved  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Wishlist
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Enquiries (contact form, call-back, shop visit)
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  message     text,
  type        text not null default 'enquiry' check (type in ('enquiry','call_back','shop_visit')),
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);

-- Offers / banners
create table if not exists public.offers (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  text        text,
  image_url   text,
  placement   text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Offer messages (the campaign the owner writes + sends)
create table if not exists public.offer_messages (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  message     text,
  photo_urls  text[] default '{}',
  channel     text not null default 'email' check (channel in ('whatsapp','email')),
  sent_by     uuid references public.users(id) on delete set null,
  sent_count  int not null default 0,
  status      text not null default 'draft' check (status in ('draft','sending','sent','failed')),
  created_at  timestamptz not null default now()
);

-- Offer message log (who got which offer)
create table if not exists public.offer_message_log (
  id                uuid primary key default gen_random_uuid(),
  offer_message_id  uuid not null references public.offer_messages(id) on delete cascade,
  user_id           uuid references public.users(id) on delete set null,
  channel           text,
  status            text not null default 'sent',   -- sent / failed
  sent_at           timestamptz not null default now()
);

-- Extra tables kept from earlier features
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.notify_me (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references public.products(id) on delete cascade,
  email       text,
  phone       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.site_settings (
  id              int primary key default 1,
  delivery_info   text,                              -- To be confirmed
  return_info     text,                              -- To be confirmed
  social_links    jsonb default '{}',
  whatsapp_number text,                              -- To be confirmed
  shop_timings    text,                              -- To be confirmed
  updated_at      timestamptz not null default now()
);


-- ============================================================
-- STEP 3. Indexes (fast search by name and by code)
-- ============================================================
create index if not exists products_name_trgm on public.products using gin (name gin_trgm_ops);
create index if not exists products_code_idx  on public.products (code);


-- ============================================================
-- STEP 4. Helper functions and triggers
-- ============================================================

-- Keep products.updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Create a public.users row automatically when someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, offers_opt_in)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'offers_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Is the current user an admin? (used by RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ============================================================
-- STEP 5. Turn on Row Level Security (RLS) for every table
-- ============================================================
alter table public.users                 enable row level security;
alter table public.categories            enable row level security;
alter table public.products              enable row level security;
alter table public.addresses             enable row level security;
alter table public.orders                enable row level security;
alter table public.order_items           enable row level security;
alter table public.payments              enable row level security;
alter table public.reviews               enable row level security;
alter table public.wishlist              enable row level security;
alter table public.enquiries             enable row level security;
alter table public.offers                enable row level security;
alter table public.offer_messages        enable row level security;
alter table public.offer_message_log     enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.notify_me             enable row level security;
alter table public.site_settings         enable row level security;


-- ============================================================
-- STEP 6. RLS policies
-- ============================================================

-- USERS: own row, or admin sees all
create policy "users_select_own_or_admin" on public.users
  for select using (auth.uid() = id or public.is_admin());
create policy "users_update_own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users_admin_all" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- CATEGORIES: anyone reads visible; admin writes
create policy "categories_public_read" on public.categories
  for select using (is_hidden = false or public.is_admin());
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- PRODUCTS: anyone reads visible; admin writes
create policy "products_public_read" on public.products
  for select using (is_hidden = false or public.is_admin());
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ADDRESSES: own only
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ORDERS: customer sees own; admin sees/changes all
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ORDER ITEMS: follows the parent order
create policy "order_items_select" on public.order_items
  for select using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_insert" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_admin_all" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- PAYMENTS: customer sees own; admin all (insert made on server with service role)
create policy "payments_select_own" on public.payments
  for select using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = payments.order_id and o.user_id = auth.uid()
    )
  );
create policy "payments_admin_all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- REVIEWS: everyone reads approved; owner reads own; customer inserts own
create policy "reviews_public_read" on public.reviews
  for select using (is_approved = true or auth.uid() = user_id or public.is_admin());
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews_admin_all" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

-- WISHLIST: own only
create policy "wishlist_own" on public.wishlist
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ENQUIRIES: anyone can send; admin reads
create policy "enquiries_insert_anyone" on public.enquiries
  for insert with check (true);
create policy "enquiries_admin_read" on public.enquiries
  for select using (public.is_admin());
create policy "enquiries_admin_all" on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- OFFERS: anyone reads active; admin writes
create policy "offers_public_read" on public.offers
  for select using (is_active = true or public.is_admin());
create policy "offers_admin_write" on public.offers
  for all using (public.is_admin()) with check (public.is_admin());

-- OFFER MESSAGES + LOG: admin only
create policy "offer_messages_admin_all" on public.offer_messages
  for all using (public.is_admin()) with check (public.is_admin());
create policy "offer_message_log_admin_all" on public.offer_message_log
  for all using (public.is_admin()) with check (public.is_admin());

-- NEWSLETTER: anyone can subscribe; admin reads
create policy "newsletter_insert_anyone" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());

-- NOTIFY ME: anyone can ask; admin reads
create policy "notify_me_insert_anyone" on public.notify_me
  for insert with check (true);
create policy "notify_me_admin_read" on public.notify_me
  for select using (public.is_admin());

-- SITE SETTINGS: public reads; admin writes
create policy "settings_public_read" on public.site_settings
  for select using (true);
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());


-- ============================================================
-- STEP 7. Storage bucket for product (and offer) photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

-- Anyone can view photos in this bucket
create policy "product_photos_public_read" on storage.objects
  for select using (bucket_id = 'product-photos');

-- Only the admin can upload, change or delete photos
create policy "product_photos_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-photos' and public.is_admin());

create policy "product_photos_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-photos' and public.is_admin())
  with check (bucket_id = 'product-photos' and public.is_admin());

create policy "product_photos_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-photos' and public.is_admin());


-- ============================================================
-- STEP 8. Basic table permissions (RLS still limits the rows)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;


-- ============================================================
-- STEP 9. After running: make yourself the admin
-- ============================================================
-- 1. Sign up once on the website (or add a user in Supabase Auth).
-- 2. Then run the line below with your email to make that user the owner/admin:
--
--    update public.users set role = 'admin' where email = 'YOUR-EMAIL-HERE';
--
-- The /admin page stays hidden from customers; only this role can open it.


-- ============================================================
-- HOW TO RUN THIS FILE
-- ============================================================
-- 1. Open https://supabase.com and log in.
-- 2. Pick your Panchaloham project.
-- 3. Left menu -> SQL Editor.
-- 4. Click "New query".
-- 5. Paste everything in this file.
-- 6. Click "Run" (or press Ctrl+Enter).
-- 7. You should see "Success. No rows returned".
-- 8. If you see an error, read it fully and fix only that line, then Run again.


-- ============================================================
-- CHECKLIST — verify in Table Editor (left menu -> Table Editor)
-- ============================================================
-- [ ] users
-- [ ] categories
-- [ ] products
-- [ ] addresses
-- [ ] orders
-- [ ] order_items
-- [ ] payments
-- [ ] reviews
-- [ ] wishlist
-- [ ] enquiries
-- [ ] offers
-- [ ] offer_messages
-- [ ] offer_message_log
-- [ ] newsletter_subscribers
-- [ ] notify_me
-- [ ] site_settings
-- [ ] Storage -> a bucket named "product-photos" exists and is Public
-- [ ] Each table -> RLS enabled (shield icon shown as "RLS enabled")
-- [ ] Authentication -> Users -> shows your test user
-- [ ] public.users has a row for that test user
-- [ ] Run: update public.users set role = 'admin' where email = 'YOUR-EMAIL';
-- [ ] public.users row now shows role = admin
