# TECH STACK — Panchaloham Jewellery E-commerce Website

Technical Stack Document
Version: 1.0 (Draft)
Store: Panchaloham Jewellery (India, prices in ₹)
Builder: Freelance solo developer (with AI help)
Related document: PRD.md

> Rules used in this document:
> - Lowest cost first. Free plans preferred.
> - No price is guessed. Every cost cell is left **blank** for you to fill.
> - Every tool has a **Free plan?** column (Yes / No / Not sure). Always verify on the official website, plans change.
> - Simple English and tables. No long paragraphs.
> - Each layer has **one main choice** and **one backup**.

---

## 1. Full Stack Table

| Layer | Tool | Why this tool (one simple line) | Free plan? | Monthly cost ₹ | Backup option |
|---|---|---|---|---|---|
| 1. Frontend | Next.js (React) | React with built-in SEO, routing and image speed — one project for pages and API | Not sure (verify on official site) | | React + Vite |
| 2. Styling and UI | Tailwind CSS | Fast to style, mobile-first, small output, matches the clean luxury look | Yes (verify) | | Bootstrap 5 |
| 3. Backend | Node.js + Express (inside Next.js API routes) | Same language as frontend, simple REST APIs, easy for one person | Yes (verify) | | Node.js + Express as a separate server |
| 4. Database | Supabase PostgreSQL | Relational tables with keys and RLS; your existing account covers DB + login + storage | Yes (verify) | | Neon or Railway Postgres |
| 5. Search (name + code) | PostgreSQL search (`ILIKE` + `pg_trgm` index) | Finds by name and by code inside the same database; free, no extra tool | Yes (verify) | | Meilisearch (self-host) or Algolia |
| 6. Login and security | Supabase Auth + Row Level Security | Secure built-in login for customers and owner, with roles and RLS rules | Yes (verify) | | Custom auth with NextAuth |
| 7. Image storage and speed | Supabase Storage (Cloudinary optional) | Store jewellery photos in the same Supabase account; Cloudinary only if you want free auto-compress | Yes (verify) | | Cloudinary / Cloudflare Images |
| 8. Payment (UPI + cards) | Razorpay | India-first, UPI + cards + netbanking, easy test mode and dashboard | No fee plan (pay per use; verify) | | Cashfree or PayU |
| 9. Delivery + pincode check | Pincode list in our own DB + Shiprocket later | Simple pincode rule first; add courier only when out-of-city grows | Yes (verify) | | Delhivery Direct / India Post |
| 10. WhatsApp / SMS / Email | WhatsApp click-to-chat link + Provider API later; Email via Resend | Start free with wa.me link; move to official API when volume grows | Yes for link (verify) | | Interakt / Gupshup (WhatsApp), Twilio (SMS), Brevo (Email) |
| 10b. Offer messages (with images) | WhatsApp Business API tool (Interakt / Gupshup) for image broadcasts + Brevo / Resend for email offers | Sends festival offer + jewellery photos to opted-in customers; email is the free starting point | Not sure (verify on official site) | | Email-only first (Brevo free), or send by hand from WhatsApp Business app |
| 11. Hosting | Vercel (frontend + backend) | One place for Next.js, HTTPS free, global CDN, free hobby tier | Yes (verify) | | Render or Railway (backend), Netlify (frontend) |
| 12. Domain + SSL | Domain from any registrar + free SSL from Vercel | SSL included free with hosting; domain is the only real cost | SSL Yes (verify) | | Cloudflare (DNS + SSL) |
| 13. Admin panel | Build ourselves inside the same app | PRD needs custom fields (codes, occasions, status flow); one codebase | Yes (verify) | | Refine / React-Admin / Strapi headless CMS |
| 14. SEO + Google Business/Maps | Next.js SEO + Google Business Profile + Google Maps embed | Free, huge for a local store; helps "near me" searches | Yes (verify) | | Bing Places (backup listing) |
| 15. Analytics | Google Analytics 4 + Google Search Console | Free, shows visitors, sources and search keywords | Yes (verify) | | Microsoft Clarity (free heatmaps) |
| 16. Backups + error monitoring | Supabase backups + Sentry free tier | Same Supabase account covers data backups; Sentry catches errors before customers report them | Not sure (verify) | | UptimeRobot + manual SQL dump |
| 17. Code, deploy, test | GitHub + Vercel auto-deploy + Playwright (later) | Free private repo, push to deploy, simple end-to-end tests | Yes (verify) | | GitLab + Netlify + Cypress |
| 18. AI coding tools | Kilo Code (VS Code) + GitHub Copilot if available | Speeds up a solo build; Kilo already in use here | Not sure (verify) | | Cursor / Codeium free tier |

### 1.1 Is Cloudinary still needed now that we use Supabase Storage?

| Question | Answer |
|---|---|
| Is Cloudinary needed to store photos? | No. Supabase Storage holds the jewellery photos in a bucket in your existing account |
| Is Cloudinary needed for compression? | Not required, but recommended. Supabase Storage stores and serves files; it does not auto-compress or resize for free |
| Options for compression | 1) Keep Cloudinary free tier for auto compress + resize + WebP/AVIF, or 2) compress photos before upload and serve from Supabase Storage |
| Best for a solo builder | Start with Supabase Storage only. If pages feel slow on mobile, add Cloudinary free tier just for image transforms |
| Cost | To be confirmed (leave blank). Verify free limits on both sites |

---

## 2. Starter Stack vs Upgrade Stack

### 2.1 Starter Stack (lowest cost, to launch)

| Layer | Starter choice | Note |
|---|---|---|
| Frontend | Next.js on Vercel (Hobby) | One project, free HTTPS |
| Styling | Tailwind CSS | Free |
| Backend | Next.js API routes (Node + Express style) | Fewer moving parts for one person |
| Database | Supabase PostgreSQL (Free) | Enough for a small shop to start |
| Search | PostgreSQL name + code search (`pg_trgm`) | No extra service |
| Auth | Supabase Auth | Built-in, free, secure |
| Images | Supabase Storage | Same account, one bucket |
| Payment | Razorpay (live keys after KYC) | Pay per successful payment |
| Pincode | Our own list in DB | Free |
| WhatsApp | wa.me click-to-chat links | Free |
| Email | Resend free tier (or Gmail SMTP) | Free within limits |
| Offer messages | Send by hand from WhatsApp Business app + email via Brevo free tier | Opt-in list exported from admin; no bulk cost at start |
| Hosting | Vercel free | Frontend + backend |
| Domain | 1 domain bought by owner | Only real fixed cost |
| Admin | Built inside the app | Free |
| SEO | Next.js + Google Business + Maps | Free |
| Analytics | GA4 + Search Console | Free |
| Backup / errors | Supabase backups + Sentry free | Free tiers (verify backup coverage) |
| Code / deploy | GitHub + Vercel | Free |
| AI help | Kilo Code | Already in use |

### 2.2 Upgrade Stack (when the store grows)

| Layer | Upgrade to | Sign that tells you to upgrade |
|---|---|---|
| Hosting | Vercel Pro or Render paid | Hobby limits hit, or need more team seats |
| Database | Supabase Pro (more DB, storage, backups) | Data near free limit, slow queries, or need daily backups |
| Search | Meilisearch or Supabase full-text search | Products in the thousands, filters feel slow |
| Images | Cloudinary paid / Supabase storage add-on | Free transforms or bandwidth used up |
| WhatsApp | Official WhatsApp Business API provider | Many order/status messages each day |
| Offer messages | Official WhatsApp Business API (bulk with images) + email tool | Many opted-in customers and offers sent often, sending by hand takes too long |
| SMS | Add SMS provider | Need fallback when customer has no WhatsApp |
| Delivery | Shiprocket / Delhivery | Out-of-city orders need tracking + labels |
| Admin | Keep custom, add roles | Staff logins and permission levels needed |
| Analytics | Add paid tools only if needed | Need deeper funnels and paid reports |
| Email | Brevo paid / Resend paid | Newsletter list grows past free limit |

### 2.3 When a free plan becomes too small (watch list)

| Tool | Free limit type to watch | Upgrade signal |
|---|---|---|
| Vercel | Bandwidth, build minutes, function time | Site slow or builds blocked |
| Supabase Database | Database size, connections | Data near free cap |
| Supabase Storage | File storage + bandwidth | Photos stop uploading or loading fast |
| Supabase Auth | Monthly active users | Many customers sign up |
| Cloudinary (if used) | Transformations + bandwidth | Photos stop loading fast |
| Resend / Brevo | Emails per day/month | Order emails bounce or queue |
| WhatsApp Business API | Message credits / per-conversation cost | Offer broadcasts cost more than expected |
| Sentry | Events per month | Errors not captured |

> Exact free limits change often. Verify each on the official website before you rely on it.

### 2.4 Supabase free plan and backups

| Item | Detail |
|---|---|
| Free plan? | Yes (verify on the official Supabase site) |
| What the free plan normally covers | A small amount of database space, file storage, bandwidth and monthly active users — enough for a small local shop to start |
| Backups on free plan | Not sure. Free plans often do NOT include automated daily backups. Verify. Daily backups and point-in-time recovery are commonly on the paid Pro plan |
| Safe habit | Even on free, keep a weekly manual SQL dump and test one restore |
| Cost | To be confirmed (leave blank) |

---

## 3. How All Parts Connect (text diagram)

```
        CUSTOMER (mobile browser, India)
                    |
                    | HTTPS
                    v
   +---------------------------------------------+
   |        VERCEL  (Next.js app)                |
   |                                             |
   |  FRONTEND (React + Tailwind)                |
   |    Home/Shop/Product/Cart/Checkout          |
   |    Account/Wishlist/Blog/Contact            |
   |                                             |
   |  BACKEND (Next.js API routes / Express)     |
   |    /api/products  /api/search  /api/orders  |
   |    /api/auth      /api/payment/verify       |
   |    /api/pincode   /api/enquiries            |
   +----+-------------+-------------+------------+
        |             |             |
        |             |             |
        v             v             v
  +------------------+  +--------------+
  |    SUPABASE      |  |  Razorpay    |
  | PostgreSQL       |  | UPI + Cards  |
  |  users/products  |  | server-side  |
  |  orders/reviews  |  | verify       |
  | Auth (login)     |  +--------------+
  | Storage (photos) |
  | RLS rules        |
  +------------------+
        |
        v
  +-------------------------------+
  | MESSAGES                      |
  |  wa.me link (now)             |
  |  WhatsApp Business API (later)|
  |  Resend email (order invoice) |
  +-------------------------------+

  ADMIN (owner in browser)
        |
        v
  /admin  (protected by login + role)
        |
        +--> manage products, categories, orders,
             enquiries, offers, banners (same DB)
        |
        +--> Offer messages:
             write offer text + add jewellery photos
                     |
                     v
             send only to customers who opted in (offersOptIn = yes)
                     |
                     v
        +------------------------+   +---------------------+
        | WhatsApp Business API  |   | Email (Brevo/Resend)|
        | offer text + images    |   | offer text + images |
        +------------------------+   +---------------------+
```

---

## 4. Risks and How to Reduce Them

| # | Risk | How to reduce it |
|---|---|---|
| R1 | Free tier runs out (hosting, DB, images) | Watch the limits table (2.3); upgrade early, keep a paid backup plan ready |
| R2 | Payment webhook missed or faked | Always confirm on server side; verify signature; never trust browser |
| R3 | Card data leak | Never store card numbers; use gateway hosted checkout; keep keys server-side only |
| R4 | Photos slow on mobile in India | Compress before upload or use Cloudinary transforms; serve from Supabase Storage; lazy load; use WebP/AVIF |
| R5 | Pincode list wrong | Keep a simple editable table; let owner update it; show clear "we do not deliver here yet" message |
| R6 | WhatsApp link blocked or limited | Start with wa.me, add official API when volume grows |
| R7 | Data loss (orders, products) | Turn on Supabase backups (check the plan covers it) + weekly manual SQL dump; test a restore once |
| R8 | Spam on enquiry form and reviews | Add captcha, rate limit, and review approval by admin |
| R9 | Admin account hacked | Strong password, 2FA, role check on every admin route, no admin links in public site |
| R10 | Solo builder bus factor | Keep code on GitHub, write a short setup guide (README + WORKLOG) |
| R11 | Language (English + local) adds confusion | Use a simple i18n file from the start; do not hardcode text |
| R12 | No cash on delivery may reduce orders | Show trust strip, reviews with photos, clear return policy to build trust |
| R13 | Order status messages looked like spam | Send only on real status change; keep messages short and useful |
| R14 | Cost surprises from gateway fees | Read Razorpay pricing page; show final amount clearly to customer |
| R15 | Offer messages seen as spam or WhatsApp number blocked | Send only to opted-in customers; put an easy opt-out in every message; keep frequency low; follow WhatsApp Business rules |
| R16 | Offer emails land in spam | Use a proper email tool (Brevo/Resend), verify domain, keep images light, allow unsubscribe |
| R17 | RLS rules wrong → customers see others' data | Test each rule, keep RLS on all tables, never put the service role key in the frontend |

---

## 5. Build Order (steps only, no dates)

| Step | What to do | Done when |
|---|---|---|
| 1 | Create GitHub repo, Next.js + Tailwind project | App runs locally |
| 2 | Set up design tokens (colours #5B3DF5, #E8DEFF, navy, fonts, spacing) | Tokens used by components |
| 3 | Build Header, Top strip, Footer, layout | Shell matches PRD Section 4 at 1440 px and 375 px |
| 4 | Build Home page sections (hero, trust strip, proprietor, categories, best sellers, bottom strip) | All 9 sections built |
| 5 | Set up Supabase project + run `supabase.sql` (tables, keys, RLS, storage bucket) | Tables and bucket visible in Supabase Table Editor |
| 6 | Build products + categories data model and APIs | API returns products with filters |
| 7 | Build Search by name AND code | Search finds by both |
| 8 | Build Shop, Collections, Product detail pages | Products show with photos, price ₹, code |
| 9 | Add Supabase Storage photo upload (+ optional Cloudinary compress) | Admin can upload a photo |
| 10 | Build auth with Supabase Auth (signup, login, roles, hidden /admin page) | Customer and admin can log in; RLS tested |
| 11 | Build wishlist, addresses, order history | Account pages work |
| 12 | Build Cart + Checkout | Cart totals correct, valid data only |
| 13 | Add pincode check | In/out of city message shows |
| 14 | Integrate Razorpay + server-side verify | Test payment succeeds, no card data stored |
| 15 | Build order success + invoice download | Invoice opens with correct items |
| 16 | Build Admin panel (products, categories, orders, enquiries, offers) | Owner can run shop alone |
| 17 | Add WhatsApp order button + order status messages | Messages send on real status change |
| 18 | Build About Us, Blog, Contact + Maps | Content pages live |
| 19 | Add SEO, Google Business Profile, GA4, Search Console | Pages indexed, analytics shows visits |
| 20 | Add Sentry + Supabase backups + uptime monitor | Errors and backups active |
| 21 | Add reviews with photos, notify me, WhatsApp share, local language | Good-to-have list done |
| 22 | Add sign-up opt-in tick box + save offersOptIn (yes / no) per customer | Preference saved and editable in My Account |
| 23 | Build admin Offer messages: write text, add jewellery photos, choose WhatsApp / email, send to opted-in list, keep send log | Owner can send one offer with photos to opted-in customers |
| 24 | Final security + mobile check, deploy live | Live URL fetched and working |

---

## 6. Accounts to Create and Details to Collect

### 6.1 Accounts to create

| # | Account | By whom | Needed for |
|---|---|---|---|
| A1 | Vercel | Builder | Hosting frontend + backend |
| A2 | Supabase (PostgreSQL + Auth + Storage) | Builder (account already ready) | Database, login, photo storage |
| A3 | Cloudinary (optional) | Builder | Free photo compression, only if pages feel slow |
| A4 | Razorpay | Owner (KYC) + Builder | UPI + card payments |
| A5 | GitHub | Builder | Code storage |
| A6 | Domain registrar | Owner | Domain name |
| A7 | Google Business Profile | Owner (verify shop) | Local search + Maps |
| A8 | Google Analytics + Search Console | Builder (owner access) | Traffic + search data |
| A9 | Sentry | Builder | Error monitoring |
| A10 | Resend or Brevo | Builder | Order emails / newsletter |
| A11 | WhatsApp Business (later) | Owner | Official order messages |
| A12 | Shiprocket / courier (later) | Owner | Out-of-city delivery |
| A13 | Instagram (already have?) | Owner | Follow Us link |
| A14 | UptimeRobot | Builder | Uptime alerts |
| A15 | WhatsApp Business API provider (Interakt / Gupshup) | Owner (KYC) + Builder | Send offer messages with jewellery images to opted-in customers |

### 6.2 Details and documents to collect

| # | Item | Needed for |
|---|---|---|
| D1 | Business name and GST details (if applicable) | Payment KYC, invoices |
| D2 | Shop address proof / PAN / bank account | Razorpay KYC |
| D3 | Owner PAN + bank account for payouts | Payment gateway |
| D4 | Shop address (with map pin) | Contact + Maps |
| D5 | Phone number | Contact, orders |
| D6 | WhatsApp number | Order button + messages |
| D7 | Instagram link | Footer + bottom strip |
| D8 | Shop timings | Contact page |
| D9 | Product names, codes, prices ₹, stock | Catalogue |
| D10 | Product photos (some need editing) | Product pages |
| D11 | Logo file | Header + invoice |
| D12 | About Us text | About page |
| D13 | Shop video | "Watch Our Story" |
| D14 | Sravanthi's photo | Proprietor section |
| D15 | Delivery pincodes / areas served | Pincode check |
| D16 | Delivery charges and times | Checkout + trust strip |
| D17 | Return / refund / exchange policy | Policy pages |
| D18 | Local language choice | Language switcher |
| D19 | Exact heading navy hex + font choices | Design tokens |
| D20 | Festival offer texts and offer jewellery photos | Offer messages |
| D21 | Opt-in tick box wording and opt-out wording for messages | Sign-up + offer messages |

---

## 7. Open Questions

| # | Question |
|---|---|
| TQ1 | Is Next.js allowed, or do you want plain React (Vite) as the main frontend? |
| TQ2 | Do you have a GitHub account already? |
| TQ3 | Do you have a domain name, or should the owner buy one? |
| TQ4 | Does the owner have GST and business documents ready for Razorpay KYC? |
| TQ5 | Should the admin panel definitely be custom, or is a ready CMS (Strapi/Refine) fine? |
| TQ6 | Which local language is the second language? |
| TQ7 | Which pincodes or areas are inside the delivery zone? |
| TQ8 | Is email (order confirmation) enough at first, or is SMS needed from day one? |
| TQ9 | When should WhatsApp move from wa.me link to the official Business API? |
| TQ10 | Who pays for the domain and any paid plans — owner or builder? |
| TQ11 | Roughly how many products will launch (tens, hundreds, thousands)? |
| TQ12 | How many orders per day do you expect at launch? |
| TQ13 | Do you want a mobile app later, or website only? |
| TQ14 | Which Supabase plan will you use (Free or Pro), and does it include backups? |
| TQ15 | Is there any existing Instagram / social account to link? |
| TQ16 | Who will write the Blog content (care tips, festival ideas)? |
| TQ17 | Are multi-language prices and GST invoices both required at launch? |
| TQ18 | Any legal pages needed (privacy, terms) for payment gateway approval? |
| TQ19 | Send offer messages by hand with WhatsApp Business, or automatically from the site? |
| TQ20 | Send offers by WhatsApp, by email, or both? |
| TQ21 | Is Cloudinary still needed for free photo compression, or will photos be compressed before upload? |
| TQ22 | Who creates the first admin user — builder in Supabase, then set role = admin? |

---

## 8. Document Rules Followed

| Rule | Followed |
|---|---|
| Lowest cost, free plan first | Yes |
| No price guessed (cost column blank) | Yes |
| Free plan Yes / No / Not sure for each tool | Yes |
| Simple English and tables | Yes |
| One main choice + one backup per layer | Yes |
| All unknowns listed in Open Questions | Yes |
