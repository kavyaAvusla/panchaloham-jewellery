# IMPLEMENTATION PLAN — Panchaloham Jewellery E-commerce Website

Implementation Plan
Version: 1.0 (Draft)
Store: Panchaloham Jewellery (India, prices in ₹)
Builder: Freelance solo developer (with AI help — DeepSeek in Kilo)
Reference documents: PRD.md, TECH-STACK.md, supabase.sql

> Rules used in this document:
> - No dates, deadlines, prices or costs. Everything unknown = **To be confirmed**.
> - Lowest cost first. Free plans first.
> - Simple English, short bullets, tables.
> - Stack is exactly what TECH-STACK.md says: Next.js + Tailwind, Supabase (PostgreSQL + Auth + Storage), Razorpay, Vercel.

---

## 0. Differences Found Between the Documents (fix these first)

Read the three files together. These do not match. Fix them before or during the noted phase.

| # | What the PRD / TECH-STACK says | What supabase.sql has | Fix |
|---|---|---|---|
| D1 | PRD has **Collections** page + `/api/collections` | No `collections` table | Add `collections` + `collection_products` tables, or build Collections from category/tags. Decide in Phase 4 |
| D2 | TECH-STACK layer 9: "Pincode list in our own DB"; PRD has pincode check | No pincode table | Add `delivery_pincodes` table (pincode, city, serviceable, charge "To be confirmed") |
| D3 | PRD 8.2 has `/api/cart` | No cart table | Decide: cart in the browser (localStorage) or add `cart_items` table. Simple choice: browser cart |
| D4 | PRD: payment UPI and cards **only** | `payments.method` also allows `netbanking`, `other` | Change check to `('upi','card')` only |
| D5 | PRD order status: placed, packed, shipped, delivered | SQL also has `cancelled` | Keep `cancelled` (useful) or remove. Decide |
| D6 | PRD 9 says Backend "Node.js with Express" | TECH-STACK says "Next.js API routes (Express style)" | Use Next.js API routes (Node runtime). Update PRD wording |
| D7 | PRD has Collections, Size guide, Blog, Invoice | No `posts` (blog) or `invoices` table | Blog can be files or add `posts`. Invoice is generated from the order (no table needed) |

> Action: after fixing, re-run the changed parts of `supabase.sql` in the SQL Editor.

---

## 1. Build Phases in Order

Work sizes: **S** = Small, **M** = Medium, **L** = Large. No days.

| Phase | Name | Work size |
|---|---|---|
| 1 | Project setup and foundation | M |
| 2 | Database setup (Supabase + supabase.sql) | S |
| 3 | Home page (9 sections) | L |
| 4 | Catalogue (Shop, Collections, Search, Product) | L |
| 5 | Auth and account (Supabase Auth + offers tick box) | M |
| 6 | Cart, Checkout, Pincode check | M |
| 7 | Payment (Razorpay, server confirm, invoice) | L |
| 8 | Admin panel core | L |
| 9 | Offer messages (admin, with photos) | M |
| 10 | Content pages (About, Blog, Contact, size guide, banner) | M |
| 11 | Order messages (WhatsApp button + status messages) | M |
| 12 | Extras (reviews with photos, notify me, share, language) | M |
| 13 | Testing and hardening | M |
| 14 | Launch | S |

---

## 2. Tasks per Phase (Frontend / Backend / Database / Admin)

### Phase 1 — Project setup and foundation (M)
- Goal: a running Next.js + Tailwind app shell that matches the design.
- Done when: Header, Top strip, Footer show at 1440 px and 375 px; colours and fonts set.

| Area | Task |
|---|---|
| Frontend | Create Next.js (App Router) + Tailwind project; set design tokens (#5B3DF5, #E8DEFF, navy, serif + sans fonts, spacing); build Header, Top strip, Footer, base layout |
| Backend | Basic app config and env loader; health check route |
| Database | None yet (next phase) |
| Admin | Create the empty `/admin` layout route (placeholder) |

### Phase 2 — Database setup (S)
- Goal: Supabase project ready with all tables, RLS and bucket.
- Done when: all tables show in Table Editor, RLS enabled, bucket `product-photos` exists.

| Area | Task |
|---|---|
| Frontend | Add Supabase browser client (anon key) |
| Backend | Add Supabase server client (service role key, server only) |
| Database | Run `supabase.sql` in SQL Editor; add the missing tables from Section 0 (collections, delivery_pincodes, or cart if chosen) |
| Admin | None |

### Phase 3 — Home page (L)
- Goal: all 9 home sections built and match the design.
- Done when: page looks right at 1440 px and 375 px; real products show in Best Sellers.

| Area | Task |
|---|---|
| Frontend | Top strip, Hero (italic line, big serif heading, divider + diamond, two buttons), floating trust strip (4 boxes, lines "To be confirmed"), proprietor section (Sravanthi placeholder), Shop By Category (6 cards), Best Sellers slider, bottom strip (brand promise, Instagram, newsletter), footer |
| Backend | APIs: list best sellers, list categories, newsletter sign-up |
| Database | Seed the 6 categories |
| Admin | None |

### Phase 4 — Catalogue (L)
- Goal: customers can find and view products by name and by code.
- Done when: search finds by name AND code; filters and sort work.

| Area | Task |
|---|---|
| Frontend | Shop grid, filter panel (category, price, metal, occasion), sort by price, Collections page + detail, Product detail (gallery, code, price, details, size, reviews, add to cart, WhatsApp button), Search box + results, size guide, empty states, breadcrumbs |
| Backend | APIs: products list, product detail, search (name + code), categories, collections |
| Database | Add `collections` + `collection_products` (fix D1); indexes on name and code |
| Admin | None (products added in Phase 8) |

### Phase 5 — Auth and account (M)
- Goal: customer can sign up (with offers tick box), log in and manage their account.
- Done when: signup saves `offers_opt_in`; customer sees only their own data.

| Area | Task |
|---|---|
| Frontend | Sign up (email/phone + "I want to get offers" tick box), Login, My Account, order history, saved addresses, wishlist, offer preference toggle |
| Backend | Use Supabase Auth signUp/signIn; read role from `users`; opt-in API |
| Database | `handle_new_user` trigger already saves tick box; confirm `users.offers_opt_in` |
| Admin | None |

### Phase 6 — Cart, Checkout, Pincode (M)
- Goal: customer builds a cart, checks pincode and places an order (no payment yet).
- Done when: order saved with valid data only; bad data rejected.

| Area | Task |
|---|---|
| Frontend | Cart page, quantity stepper, checkout form, address select/add, pincode check box, order success page |
| Backend | APIs: cart (browser or table), create order, pincode check, orders history |
| Database | Add `delivery_pincodes` (fix D2); order + order_items saved with server checks |
| Admin | None |

### Phase 7 — Payment (L)
- Goal: UPI and card payment works, confirmed on the server, invoice downloadable.
- Done when: test payment succeeds; no card data stored; wrong signature rejected.

| Area | Task |
|---|---|
| Frontend | Pay button, Razorpay checkout (test mode first), payment result states, invoice download |
| Backend | Create order, create Razorpay order, verify signature on server, update order + payment status |
| Database | Payments row written server-side only; restrict method to upi/card (fix D4) |
| Admin | None |

### Phase 8 — Admin panel core (L)
- Goal: owner can run the shop alone.
- Done when: owner adds a product with photos and changes an order status.

| Area | Task |
|---|---|
| Frontend | `/admin` login (hidden), dashboard, product add/edit/hide, category manager, order list + status, enquiry list, customers, banners |
| Backend | Admin-only APIs guarded by role; image upload to Supabase Storage |
| Database | Insert/update products, categories, orders, offers via admin APIs (RLS allows admin) |
| Admin | All the above screens |

### Phase 9 — Offer messages (M)
- Goal: owner writes an offer with jewellery photos and sends it to opted-in customers.
- Done when: one offer sent to the opted-in list; send log saved.

| Area | Task |
|---|---|
| Frontend | Offer composer (title, text, photos, channel WhatsApp/email), send button, send log |
| Backend | APIs: create offer message, send to customers where `offers_opt_in = true`, log each send |
| Database | `offer_messages` + `offer_message_log` used; RLS admin-only |
| Admin | "Send offer messages" screen |

### Phase 10 — Content pages (M)
- Goal: About Us, Blog, Contact, offers banner, size guide live.
- Done when: pages show owner content; Google map and enquiry form work.

| Area | Task |
|---|---|
| Frontend | About Us (story, Sravanthi, meaning of Panchaloham), Blog list + post, Contact (phone, WhatsApp, address, map, timings, enquiry form, call-back/visit), festival offers banner, size guide |
| Backend | APIs: enquiries, blog content, settings |
| Database | `enquiries` insert for anyone; `site_settings` values (To be confirmed) |
| Admin | Offers/banner screen, enquiries screen |

### Phase 11 — Order messages (M)
- Goal: WhatsApp order button + order status messages.
- Done when: a status change sends one WhatsApp/email message.

| Area | Task |
|---|---|
| Frontend | WhatsApp order button on product page; "share product on WhatsApp" |
| Backend | Send status message on real status change (WhatsApp link/API or email) |
| Database | Read orders/customers; log messages |
| Admin | Admin message buttons on order screen |

### Phase 12 — Extras (M)
- Goal: good-to-have list done.
- Done when: reviews with photos, notify me and language switch work.

| Area | Task |
|---|---|
| Frontend | Reviews with photos + review form, out-of-stock "notify me", WhatsApp share, language switcher (English + local) |
| Backend | APIs: reviews, notify-me; i18n text file |
| Database | `reviews` (approved flag), `notify_me` |
| Admin | Approve reviews; see notify-me list |

### Phase 13 — Testing and hardening (M)
- Goal: prove it works before launch.
- Done when: the Section 14 tests pass.

| Area | Task |
|---|---|
| Frontend | Test on phone (375 px) and computer (1440 px) |
| Backend | Test all API routes and error cases |
| Database | Test RLS as customer and as admin |
| Admin | Test each admin screen |

### Phase 14 — Launch (S)
- Goal: live site working.
- Done when: Section 15 checklist is done.

| Area | Task |
|---|---|
| Frontend | Final mobile check; deploy to Vercel |
| Backend | Live env vars set; payment live mode |
| Database | Backups on; first admin user set |
| Admin | Test order placed and seen in admin |

---

## 3. Setup Steps Before Coding

### 3.1 Accounts to create

| # | Account | Who | Why |
|---|---|---|---|
| 1 | Supabase | Builder (already have) | Database, Auth, Storage |
| 2 | GitHub | Builder | Code storage |
| 3 | Vercel | Builder | Hosting (frontend + API) |
| 4 | Razorpay | Owner (KYC) + Builder | UPI + cards |
| 5 | Cloudinary (optional) | Builder | Extra photo compression if needed |
| 6 | Resend or Brevo | Builder | Order + offer emails |
| 7 | Sentry | Builder | Error monitoring |
| 8 | Google Analytics + Search Console | Builder | Traffic + search data |
| 9 | Google Business Profile | Owner | Maps + local search |
| 10 | WhatsApp Business API (later) | Owner | Offer + status messages |
| 11 | UptimeRobot | Builder | Uptime alerts |

### 3.2 Keys and the `.env` file

Create `.env.local` in the project root (never commit it).

| Variable | Reaches browser? | Where used |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Yes (safe) | Supabase client |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes (safe with RLS) | Supabase client |
| SUPABASE_SERVICE_ROLE_KEY | **No — server only** | Admin/order APIs |
| RAZORPAY_KEY_ID | Server only | Create payment |
| RAZORPAY_KEY_SECRET | **No — server only** | Verify signature |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Yes (safe) | Checkout on page |
| RESEND_API_KEY (or Brevo key) | **No — server only** | Emails |
| WHATSAPP_API_KEY (later) | **No — server only** | Offer/status messages |
| NEXT_PUBLIC_SITE_URL | Yes (safe) | Links + callbacks |

### 3.3 How to keep keys safe

| Rule | Detail |
|---|---|
| Add `.env.local` to `.gitignore` first | Do this before the first commit |
| Only `NEXT_PUBLIC_` vars reach the browser | Everything else stays on the server |
| Never print a full key | Not in logs, chat, screenshots or code comments |
| Set the same keys in Vercel | Project → Settings → Environment Variables. Local `.env` is not uploaded |
| Rotate if a key leaks | Regenerate in Supabase / Razorpay, update everywhere |
| Service role key never in frontend | Use it only inside `/api` server routes |

---

## 4. Folder Structure

```
panchaloha-website/
├─ app/
│  ├─ layout.tsx                # Top strip, Header, Footer
│  ├─ page.tsx                  # Home
│  ├─ shop/page.tsx
│  ├─ collections/[slug]/page.tsx
│  ├─ product/[id]/page.tsx
│  ├─ search/page.tsx
│  ├─ about/page.tsx
│  ├─ blog/page.tsx
│  ├─ blog/[slug]/page.tsx
│  ├─ contact/page.tsx
│  ├─ size-guide/page.tsx
│  ├─ cart/page.tsx
│  ├─ checkout/page.tsx
│  ├─ order-success/page.tsx
│  ├─ login/page.tsx
│  ├─ signup/page.tsx
│  ├─ account/                  # My Account, orders, addresses, wishlist
│  │  ├─ page.tsx
│  │  ├─ orders/page.tsx
│  │  ├─ addresses/page.tsx
│  │  └─ wishlist/page.tsx
│  ├─ admin/                    # Owner only, hidden, role checked
│  │  ├─ layout.tsx             # Admin gate (login + role)
│  │  ├─ login/page.tsx
│  │  ├─ page.tsx               # Dashboard
│  │  ├─ products/page.tsx
│  │  ├─ categories/page.tsx
│  │  ├─ orders/page.tsx
│  │  ├─ enquiries/page.tsx
│  │  ├─ customers/page.tsx
│  │  ├─ offers/page.tsx
│  │  └─ offer-messages/page.tsx
│  └─ api/
│     ├─ products/route.ts
│     ├─ categories/route.ts
│     ├─ collections/route.ts
│     ├─ search/route.ts
│     ├─ orders/route.ts
│     ├─ payment/create/route.ts
│     ├─ payment/verify/route.ts
│     ├─ pincode/check/route.ts
│     ├─ reviews/route.ts
│     ├─ enquiries/route.ts
│     ├─ newsletter/route.ts
│     ├─ notify-me/route.ts
│     ├─ offers/opt-in/route.ts
│     └─ admin/                 # All admin-only
│        ├─ products/route.ts
│        ├─ categories/route.ts
│        ├─ orders/route.ts
│        ├─ enquiries/route.ts
│        ├─ customers/route.ts
│        ├─ offers/route.ts
│        ├─ offer-messages/route.ts
│        ├─ upload/route.ts
│        └─ settings/route.ts
├─ components/                   # Reusable UI (see Section 8)
├─ lib/
│  ├─ supabase/client.ts         # Browser client (anon key)
│  ├─ supabase/server.ts         # Server client (service role, server only)
│  ├─ i18n/                      # English + local language text
│  └─ helpers/                   # price ₹, dates, pincode, validation
├─ public/                       # logo, placeholder images, icons
├─ supabase.sql                  # DB setup (already created)
├─ .env.local                    # keys (not committed)
├─ .gitignore                    # includes .env.local
├─ PRD.md
├─ TECH-STACK.md
├─ IMPLEMENTATION-PLAN.md
├─ WORKLOG.md
└─ REPORT.md
```

---

## 5. Database: run supabase.sql and check it

### 5.1 How to run

| Step | Action |
|---|---|
| 1 | Open https://supabase.com and log in |
| 2 | Pick the Panchaloham project |
| 3 | Left menu → **SQL Editor** |
| 4 | Click **New query** |
| 5 | Paste everything in `supabase.sql` |
| 6 | Click **Run** (Ctrl+Enter) |
| 7 | Expect "Success. No rows returned" |
| 8 | Add the missing tables from Section 0 (collections, delivery_pincodes, or cart) and Run again |

### 5.2 How to check the tables

| Check | Where | Expected |
|---|---|---|
| All tables exist | Table Editor | users, categories, products, addresses, orders, order_items, payments, reviews, wishlist, enquiries, offers, offer_messages, offer_message_log, newsletter_subscribers, notify_me, site_settings |
| Photo bucket | Storage | `product-photos` exists and is Public |
| RLS on | Each table | "RLS enabled" shown |
| Test user | Authentication → Users | Your test user listed |
| Profile row | public.users | A row for that user |
| Make owner | SQL Editor | `update public.users set role = 'admin' where email = 'YOUR-EMAIL';` then check `role = admin` |

---

## 6. Security

| Area | Rule |
|---|---|
| RLS on every table | Already set in `supabase.sql`; keep it on |
| Customer sees own data | Orders, order items, wishlist, addresses only |
| Public read | Only products and categories that are not hidden |
| Admin only | Add/edit products, prices, stock, categories, offers, offer messages |
| Admin page | `/admin` hidden from customers; role checked on every admin route |
| Service role key | Server routes only, never in the browser |
| Anon key | Safe to expose **only** because RLS protects the data |
| Payment | Confirm on the server; verify signature; never trust the browser |
| Card data | Never stored anywhere |
| Passwords | Handled by Supabase Auth; we never store them |
| Enquiries/reviews | Captcha + rate limit; reviews need admin approval |

**Keys that must NEVER be in the frontend:** `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RESEND_API_KEY`, `WHATSAPP_API_KEY`.

---

## 7. API Routes

| Method | Path | What it does | Who |
|---|---|---|---|
| GET | /api/products | List with filters, sort, paging | Public |
| GET | /api/products/[id] | One product | Public |
| GET | /api/search | Find by name and code | Public |
| GET | /api/categories | Category list | Public |
| GET | /api/collections | Collections list | Public |
| POST | /api/pincode/check | Is this pincode serviceable? | Public |
| POST | /api/enquiries | Send enquiry / call-back / visit request | Public |
| POST | /api/newsletter | Newsletter sign-up | Public |
| POST | /api/notify-me | Out-of-stock notify | Public |
| POST | /api/reviews | Add review (with photos) | Customer |
| GET | /api/orders | Own order history | Customer |
| POST | /api/orders | Create order | Customer |
| POST | /api/payment/create | Create Razorpay order | Customer |
| POST | /api/payment/verify | Server-side payment confirm | Customer (server work) |
| GET | /api/orders/[id]/invoice | Download invoice | Customer (own) |
| POST | /api/offers/opt-in | Set offer preference yes/no | Customer |
| GET | /api/admin/products | List all products | Admin |
| POST | /api/admin/products | Add product | Admin |
| PATCH | /api/admin/products/[id] | Edit / hide / price / stock | Admin |
| GET/POST | /api/admin/categories | Manage categories | Admin |
| GET | /api/admin/orders | See all orders | Admin |
| PATCH | /api/admin/orders/[id] | Change status + send message | Admin |
| GET | /api/admin/enquiries | See enquiries | Admin |
| GET | /api/admin/customers | See customers + opt-in status | Admin |
| GET/POST | /api/admin/offers | Manage banner + offers | Admin |
| POST | /api/admin/offer-messages | Create offer | Admin |
| POST | /api/admin/offer-messages/send | Send to opted-in customers | Admin |
| GET | /api/admin/offer-messages | See past offers + send log | Admin |
| POST | /api/admin/upload | Upload photo to Supabase Storage | Admin |
| GET/PATCH | /api/admin/settings | Shop settings | Admin |

---

## 8. Frontend Pages and Components

### 8.1 Pages

| Group | Pages |
|---|---|
| Public | Home, Shop, Collections, Collection detail, Product detail, Search results, Size guide, About Us, Blog list, Blog post, Contact |
| Buying | Cart, Checkout, Order success |
| Account | Login, Sign up, My Account, Order history, Addresses, Wishlist, Invoice |
| Admin | Admin login, Dashboard, Products, Categories, Orders, Enquiries, Customers, Offers and banners, Offer messages |

### 8.2 Reusable components

| Component | Used on |
|---|---|
| Header (logo, 6 tabs, search, account, cart badge) | All public/customer pages |
| Top strip ("Every day new collections") | All pages |
| Footer (links, contact, social, payment icons) | All pages |
| Hero banner | Home |
| Trust strip (4 boxes) | Home |
| Category card | Home, Shop |
| Product card (photo, heart, name, code, stars, reviews, ₹, add-to-cart) | Home, Shop, Collections, Search |
| Best-seller slider | Home |
| Proprietor section | Home |
| Newsletter box | Home, Footer |
| Search box | Header, Search page |
| Filter panel | Shop |
| Sort dropdown | Shop |
| Image gallery | Product detail |
| Size selector | Product detail |
| Review list + review form | Product detail |
| Wishlist heart button | Product card, Product detail |
| Add-to-cart button | Product card, Product detail |
| WhatsApp order button | Product detail |
| Quantity stepper | Cart, Product detail |
| Price display (₹) | Everywhere price shows |
| Pincode check box | Product detail, Cart, Checkout |
| Breadcrumb | Shop, Collections, Product |
| Empty state | Cart, Wishlist, Search |
| Toast / message | All actions |
| Language switcher | Header |
| Offer opt-in tick box | Sign up, My Account |
| Offer composer | Admin offer messages |
| Admin table + form | All admin pages |
| Admin guard (role check) | All /admin pages |

---

## 9. Admin Panel

### 9.1 Screens

| Screen | Actions |
|---|---|
| Admin login | Owner login only; page hidden from customers |
| Dashboard | New orders, new enquiries, quick counts |
| Products | Add, edit, hide, price, stock, code, photos |
| Categories | Add, edit, order, hide |
| Orders | See orders, change status, send message |
| Enquiries | See enquiry / call-back / visit requests |
| Customers | See customers and who agreed to get offers |
| Offers and banners | Home page banner + festival offers |
| Offer messages | Write and send offers with photos |

### 9.2 "Send offer messages" — step by step

| Step | What happens |
|---|---|
| 1 | Owner opens `/admin/offer-messages` |
| 2 | Writes a title and offer text |
| 3 | Adds jewellery photos (uploaded to Supabase Storage) |
| 4 | Chooses channel: WhatsApp and/or email |
| 5 | Sees the count of opted-in customers |
| 6 | Clicks Send |
| 7 | Server fetches customers where `offers_opt_in = true` only |
| 8 | Sends via the chosen channel |
| 9 | Writes one `offer_message_log` row per customer (sent / failed) |
| 10 | Owner sees the send log and can resend failed ones |

| Rule | Detail |
|---|---|
| Opt-in only | Never send to customers who said no |
| Opt-out | Every message must have a simple way to stop offers |
| Frequency | Keep low; follow WhatsApp Business rules |

---

## 10. Payment Flow (Razorpay, UPI + Cards) — step by step

Test mode first. Never store card data.

| Step | Who | Action |
|---|---|---|
| 1 | Customer | Fills checkout, sees final amount (₹) |
| 2 | Frontend | Calls `/api/orders` to create the order (status placed, pending) |
| 3 | Backend | Calls Razorpay to create a payment order; returns Razorpay order id |
| 4 | Frontend | Opens Razorpay checkout (UPI + cards) |
| 5 | Customer | Pays by UPI or card |
| 6 | Razorpay | Returns payment id, order id, signature |
| 7 | Frontend | Sends these to `/api/payment/verify` |
| 8 | Backend | Verifies signature with `RAZORPAY_KEY_SECRET` |
| 9 | Backend | If valid: mark order paid, write `payments` row. If not: mark failed |
| 10 | Backend | Webhook (backup) also confirms the payment |
| 11 | Frontend | Shows Order success + invoice download |

| Rule | Detail |
|---|---|
| Test first | Use Razorpay test keys until a full test payment passes |
| No card data | Card numbers never reach our server or database |
| Server confirm | Trust only the verified signature, never the browser |
| Live later | Switch to live keys only on launch |

---

## 11. Search by Name and Code

| Part | How |
|---|---|
| Name search | PostgreSQL `ILIKE` on `products.name` (partial words allowed) |
| Code search | Exact or partial match on `products.code` (unique) |
| Speed | Index on `code` + trigram (pg_trgm) index on `name` (already in supabase.sql) |
| Query | `/api/search?q=...` searches both fields, returns hidden=false products only |
| Free | No extra tool; runs inside Supabase |
| Later | If products reach thousands, move to Supabase full-text search or Meilisearch |

Example idea:
```
select * from products
where is_hidden = false
  and (name ilike '%'||q||'%' or code ilike '%'||q||'%')
order by name;
```

---

## 12. Photo Upload and Compression

| Step | How |
|---|---|
| Upload | Admin uploads from `/admin/products` → `product-photos` bucket |
| Who can upload | Admin only (storage policy checks `is_admin()`) |
| View | Bucket is public read, so product images load fast |
| Compression (simple) | Compress before upload (target small size) or use Cloudinary free transforms |
| Cloudinary | Not required to store; useful only for auto compress + resize + WebP/AVIF |
| Speed | Use next/image, lazy load, correct width/height, alt text |
| Store | Save URLs in `products.photo_urls` (and `offer_messages.photo_urls`) |

---

## 13. Order Status Updates and Messages

| Status | Set by | Message |
|---|---|---|
| placed | system on order | Order placed message |
| packed | admin | "Your order is packed" |
| shipped | admin | "Your order is shipped" |
| delivered | admin | "Your order is delivered" |
| cancelled | admin | "Your order is cancelled" |

| Rule | Detail |
|---|---|
| Send only on real change | Do not send twice for the same status |
| Channel | WhatsApp (link now, API later) or email |
| Test | Use the owner's own number/email first |
| Log | Save what was sent and when |

---

## 14. Testing Plan

| Area | What to test | How |
|---|---|---|
| Phone | All pages at 375 px | Real phone or browser phone view |
| Computer | All pages at 1440 px | Browser |
| Search | Name and code both work | Type part of a name and a full code |
| Signup | Offers tick box saves yes/no | Check `users.offers_opt_in` in Supabase |
| Cart + checkout | Totals correct; bad data rejected | Try empty required fields |
| Payment | Test mode UPI + card | Razorpay test cards; check server verify |
| Orders | Order appears in account and admin | Place a test order |
| Admin | Add/edit/hide product; change status | Do each action |
| Offer messages | Sends only to opted-in | One opted-in and one opted-out test user |
| Security | Customer cannot see others' data | Log in as two users; check RLS |
| Security | Admin routes blocked for customers | Open `/api/admin/...` as a customer |

---

## 15. Launch Checklist

| # | Item | Done |
|---|---|---|
| 1 | Domain bought and connected | ☐ |
| 2 | HTTPS working (free SSL) | ☐ |
| 3 | Live env vars set in Vercel | ☐ |
| 4 | Razorpay switched to live keys | ☐ |
| 5 | Supabase backups on (check plan) | ☐ |
| 6 | First admin user created (role = admin) | ☐ |
| 7 | Test order placed end to end | ☐ |
| 8 | Emails / WhatsApp messages sending | ☐ |
| 9 | Mobile + desktop final check | ☐ |
| 10 | No keys in the frontend | ☐ |
| 11 | Google Business/Map + analytics live | ☐ |
| 12 | Live site fetched and working | ☐ |

---

## 16. Work Size per Phase

| Phase | Work size |
|---|---|
| 1 Project setup and foundation | M |
| 2 Database setup | S |
| 3 Home page | L |
| 4 Catalogue | L |
| 5 Auth and account | M |
| 6 Cart, Checkout, Pincode | M |
| 7 Payment | L |
| 8 Admin panel core | L |
| 9 Offer messages | M |
| 10 Content pages | M |
| 11 Order messages | M |
| 12 Extras | M |
| 13 Testing and hardening | M |
| 14 Launch | S |

---

## 17. Risks and How to Reduce Them

| # | Risk | How to reduce it |
|---|---|---|
| R1 | Free plan runs out (Supabase, Vercel, storage) | Watch limits; upgrade early |
| R2 | RLS rules wrong → data leak | Test each rule; keep RLS on all tables |
| R3 | Service role key exposed | Server only; never in frontend |
| R4 | Payment faked or missed | Server verify + webhook backup |
| R5 | Photos slow on mobile | Compress; next/image; lazy load |
| R6 | Missing tables (collections, pincode) | Fix Section 0 before Phase 4 and 6 |
| R7 | WhatsApp offers marked as spam | Opt-in only; easy opt-out; low frequency |
| R8 | Data loss | Supabase backups + weekly SQL dump |
| R9 | Solo builder bus factor | Code on GitHub; WORKLOG + README |
| R10 | Admin page found by customers | Hide link; role check on every admin route |
| R11 | Language confusion | i18n file from the start |
| R12 | No cash on delivery lowers trust | Trust strip, reviews, clear returns |

---

## 18. AI Prompts per Phase (for DeepSeek in Kilo)

| Phase | Prompt to paste |
|---|---|
| 1 | "Read PRD.md and TECH-STACK.md. Set up a Next.js App Router + Tailwind project. Add design tokens (#5B3DF5, #E8DEFF, navy, serif + sans fonts, spacing). Build Top strip, Header (logo, 6 tabs, search, account, cart badge) and Footer. Show it works at 1440 px and 375 px." |
| 2 | "Read supabase.sql. Explain each table. Then set up the Supabase browser and server clients in lib/supabase. Do not put the service role key in the frontend. List the exact steps to run supabase.sql in the SQL Editor." |
| 3 | "Build the Home page with all 9 sections from PRD Section 4 using Tailwind. Use categories and best sellers from Supabase. Use a Sravanthi photo placeholder. Make it match the design at 1440 px and 375 px." |
| 4 | "Build Shop, Collections, Product detail and Search. Search must match by jewellery name AND code using Supabase ILIKE. Add filters (category, price, metal, occasion) and sort by price. Use the collections table (add it if missing)." |
| 5 | "Add Supabase Auth signup and login. Signup must include the 'I want to get offers' tick box and save offers_opt_in. Build My Account, order history, addresses and wishlist pages. Customers must see only their own data." |
| 6 | "Build Cart, Checkout and Pincode check. Save orders and order_items with server-side validation that rejects missing required fields. Add the delivery_pincodes table and /api/pincode/check." |
| 7 | "Integrate Razorpay for UPI and cards. Create order on server, open checkout, then verify the signature on the server in /api/payment/verify. Never store card data. Use test mode first. Add order success and invoice download." |
| 8 | "Build the /admin area with owner login (hidden from customers) and a role check on every route. Add Dashboard, Products (add/edit/hide, price, stock, photos, code), Categories, Orders (status change), Enquiries, Customers and Offers/banners. Upload photos to the Supabase Storage bucket product-photos." |
| 9 | "Add the admin Offer messages screen: write title and text, add jewellery photos, choose WhatsApp or email, send only to customers where offers_opt_in = true, and save a send log in offer_message_log." |
| 10 | "Build About Us, Blog, Contact (phone, WhatsApp, address, map, timings, enquiry form) and the size guide. Add the festival offers banner. Save enquiries and read site_settings." |
| 11 | "Add a WhatsApp order button on the product page and send an order status message only when the status actually changes. Log what was sent." |
| 12 | "Add reviews with photos (admin approves), out-of-stock notify me, WhatsApp share, and a language switcher (English + local language) using an i18n file." |
| 13 | "Write and run tests for search, signup opt-in, cart totals, test-mode payment, order creation, admin actions and RLS. List results in REPORT.md with the real output." |
| 14 | "Prepare launch: check env vars in Vercel, switch Razorpay to live, confirm Supabase backups, create the first admin user, place a test order, and fetch the live URL. Paste the real status." |

---

## 19. Open Questions

| # | Question |
|---|---|
| OQ1 | Collections: add a collections table, or build from categories/tags? |
| OQ2 | Pincode: which pincodes or areas are serviceable (for delivery_pincodes)? |
| OQ3 | Cart: keep it in the browser, or save logged-in carts in a table? |
| OQ4 | Order statuses: keep "cancelled" as a status? |
| OQ5 | Blog: use files, or add a posts table managed in admin? |
| OQ6 | Which local language is the second language? |
| OQ7 | Send offer messages by hand with WhatsApp Business, or automatically from the site? |
| OQ8 | Send offers by WhatsApp, by email, or both? |
| OQ9 | Is Cloudinary used for compression, or are photos compressed before upload? |
| OQ10 | Which Supabase plan is used, and does it include backups? |
| OQ11 | Which hosting service and domain? |
| OQ12 | Which WhatsApp Business API provider (when not using wa.me)? |
| OQ13 | Who creates the first admin user and provides the admin email? |
| OQ14 | Are GST invoices and the local language needed at launch? |

---

## Document Rules Followed

| Rule | Followed |
|---|---|
| No dates, deadlines, prices or costs | Yes |
| Lowest cost, free plans first | Yes |
| Simple English, short bullets and tables | Yes |
| Differences between documents listed first | Yes (Section 0) |
| All 19 requested items included | Yes |
