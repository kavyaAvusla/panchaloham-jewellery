# PRD — Panchaloham Jewellery E-commerce Website

Product Requirements Document
Version: 1.0 (Draft)
Store: Panchaloham Jewellery (India, prices in ₹)
Prepared by: Freelance builder
Owner: Sravanthi (proprietor)
Status: Draft for owner review

> Simple rule for this document: if a number, name, price, date or fee was not given, it is written as **To be confirmed** and collected in Section 15 (Open Questions). Nothing is guessed.

---

## 1. Overview and Goals

### 1.1 Overview

| Item | Detail |
|---|---|
| Business | Panchaloham Jewellery, a local jewellery store in India |
| Special product | Panchaloham jewellery |
| How customers buy today | WhatsApp, phone calls, shop visits |
| What we are building | An e-commerce website with online payment and home delivery |
| Payments | UPI and cards only. No cash on delivery |
| Delivery area | Inside the city and outside the city |
| Product photos | Ready. Some need small editing |

### 1.2 Goals

| # | Goal | Why |
|---|---|---|
| G1 | Sell online with online payment (UPI, cards) | More sales without shop visit |
| G2 | Deliver outside the city | Reach more customers |
| G3 | Keep WhatsApp as an easy order path | Customers already use it |
| G4 | Show the brand in a clean, luxury style | Trust and higher value feel |
| G5 | Give the owner a simple admin panel | Owner updates products herself |
| G6 | Mobile-first experience | Most customers use phones |
| G7 | Send festival offer messages with photos to customers | Bring customers back and grow repeat sales |

### 1.3 Non-Goals (not in this version)

- No cash on delivery.
- No multi-vendor marketplace.
- No mobile app (website first).
- No guessing of prices, delivery charges, return windows or offers.

---

## 2. Users

| User | Where | Main needs | Key pages |
|---|---|---|---|
| Local customer | Same city | Buy quickly, check pincode, fast delivery | Home, Shop, Product, Cart, Checkout |
| Customer in another city | Outside city | Trust photos, clear delivery info, online payment | Home, Product, Pincode check, Checkout |
| Gift buyer | Anywhere | Ideas, occasions, easy share on WhatsApp | Collections, Blog, Product share |
| Shop owner / staff | Shop | Add products, manage orders, send offers to customers | Admin panel |

---

## 3. Website Tabs and Page List

### 3.1 Top menu (left to right)

| Order | Tab | Notes |
|---|---|---|
| 1 | Home | Default page |
| 2 | Shop | Product grid with filters |
| 3 | Collections | Special / curated sets |
| 4 | About Us | Story, Sravanthi, meaning of Panchaloham |
| 5 | Blog | Care tips, festival ideas, styling |
| 6 | Contact | Phone, WhatsApp, address, map, timings |

Active tab has a thin underline.

### 3.2 Top-right icons

| Icon | Behaviour |
|---|---|
| Search | Opens search box. Finds by product name and by jewellery code |
| My Account | Login, orders, addresses, wishlist |
| Cart | Opens cart. Shows a small badge with item count |

### 3.3 Full page list

| # | Page | Type |
|---|---|---|
| 1 | Home | Public |
| 2 | Shop | Public |
| 3 | Collections | Public |
| 4 | Collection detail | Public |
| 5 | Product detail | Public |
| 6 | About Us | Public |
| 7 | Blog list | Public |
| 8 | Blog post | Public |
| 9 | Contact | Public |
| 10 | Search results | Public |
| 11 | Cart | Public |
| 12 | Checkout | Public |
| 13 | Order success | Public |
| 14 | Login | Public |
| 15 | Sign up | Public |
| 16 | My Account (orders, addresses, wishlist) | Customer only |
| 17 | Order history | Customer only |
| 18 | Invoice download | Customer only |
| 19 | Size guide (bangles, rings) | Public |
| 20 | Admin login | Owner only |
| 21 | Admin dashboard | Owner only |
| 22 | Admin products | Owner only |
| 23 | Admin categories | Owner only |
| 24 | Admin orders | Owner only |
| 25 | Admin enquiries and customers | Owner only |
| 26 | Admin offers and banners | Owner only |
| 27 | Admin offer messages (send offer to customers) | Owner only |

---

## 4. Home Page Sections (top to bottom)

| # | Section | What it contains |
|---|---|---|
| 1 | Top strip | Text: "Every day new collections". Shows on every page at the very top |
| 2 | Header | Logo left, 6 tabs centre, search + account + cart right. Active tab thin underline |
| 3 | Hero banner | Left: small italic line "Tradition You Can Wear," big serif heading "Panchaloham, Made For You", thin divider with a small diamond, short line "Beautiful panchaloham and imitation jewellery for every festival and every day.", two buttons — filled "Shop Collection" with arrow, and outlined round "Watch Our Story" (opens shop video). Right: large photo of a model wearing jewellery |
| 4 | Floating trust strip | Rounded bar below hero. 4 boxes, each with icon, title, one small line: Premium Quality, Delivery, Secure Payment, Easy Returns. Delivery, payment and return lines: To be confirmed |
| 5 | Proprietor section | Photo of Sravanthi (placeholder), her name, short welcome note |
| 6 | Shop By Category | Row of rounded photo cards. Each card: category name + "Explore Now" link. Uses the 6 categories |
| 7 | Best Sellers | Horizontal slider with arrow button. Card: photo, heart icon top-right, name, jewellery code, star rating, review count, price in ₹, small round add-to-cart button |
| 8 | Bottom strip | 3 parts: brand promise "Made with Tradition", Instagram "Follow Us" link, Newsletter email box |
| 9 | Footer | Quick links, contact details, social icons, payment icons |

---

## 5. Design Guide

### 5.1 Colour theme

| Use | Colour | Hex |
|---|---|---|
| Main colour and buttons | Electric Indigo | #5B3DF5 |
| Button text | White | #FFFFFF |
| Background and soft areas | Soft Lilac | #E8DEFF |
| Heading text | Dark navy | To be confirmed (suggested dark navy) |
| Small accents | Thin indigo lines and a small temple-pattern border | #5B3DF5 |

Rule: indigo is an accent, about one tenth of the screen. White space is the main background.

### 5.2 Fonts

| Use | Font | Note |
|---|---|---|
| Headings | Elegant serif | Exact font: To be confirmed |
| Body text | Simple sans-serif | Exact font: To be confirmed |

Headings much larger than body. Body 16 px or more, line height about 1.6, line length 60 to 75 characters.

### 5.3 Spacing and shapes

| Item | Rule |
|---|---|
| Section spacing | At least 96 px top and bottom on laptop, 56 px on phone |
| One idea per section | Yes |
| Corners | Soft rounded corners on cards, buttons, images |
| Decoration | Small flower or leaf line drawings, thin rules |
| Mobile | Works at 375 px wide, one column, tap targets at least 44 px, no sideways scroll |

### 5.4 Buttons and cards

| Element | Rule |
|---|---|
| Filled button | Electric Indigo background, white text, rounded, optional right arrow |
| Outline button | Thin border, transparent background |
| Play button | Outlined round button with play icon |
| Product card | Photo, heart top-right, name, code, stars, review count, ₹ price, round add-to-cart |
| Category card | Photo, category name, "Explore Now" link |

### 5.5 Highlighted text (as given)

| Place | Text |
|---|---|
| Small italic line | Tradition You Can Wear, |
| Big heading | Panchaloham, Made For You |
| Short line | Beautiful panchaloham and imitation jewellery for every festival and every day. |
| Bottom promise | Made with Tradition |

---

## 6. Features — Must Have and Good to Have

### 6.1 Must Have

| # | Feature | Side |
|---|---|---|
| M1 | Home page as in Section 4 | Customer |
| M2 | Search by product name and jewellery code | Customer |
| M3 | Shop page: grid, filters (category, price, metal, occasion), sort by price | Customer |
| M4 | Collections page | Customer |
| M5 | Product detail: photos, name, code, price, details, size, reviews, add to cart, WhatsApp order button | Customer |
| M6 | Cart, checkout, order success | Customer |
| M7 | Online payment: UPI and cards (gateway to be chosen) | Customer |
| M8 | Pincode check for delivery | Customer |
| M9 | Login and sign up | Customer |
| M10 | Order history and saved addresses | Customer |
| M11 | Wishlist (heart icon) | Customer |
| M12 | Contact page: phone, WhatsApp, address, map, timings, enquiry form | Customer |
| M13 | Newsletter sign-up | Customer |
| M14 | Instagram link | Customer |
| M15 | Mobile-first design | Customer |
| M16 | Owner login | Admin |
| M17 | Admin dashboard: new orders and enquiries | Admin |
| M18 | Admin add, edit, hide products; change price, stock, photos, code | Admin |
| M19 | Admin manage categories | Admin |
| M20 | Admin manage orders and status (placed, packed, shipped, delivered) | Admin |
| M21 | Admin see enquiries and customers | Admin |
| M22 | Sign-up tick box "I want to get offers"; save yes / no for each customer | Customer |
| M23 | Owner writes a festival offer, adds jewellery photos, and sends it to all logged-in customers who agreed to get offers (WhatsApp or email) | Admin |

### 6.2 Good to Have

| # | Feature | Side |
|---|---|---|
| G1 | Customer reviews with photos | Customer |
| G2 | About Us story, Sravanthi, meaning of Panchaloham, shop photos | Customer |
| G3 | Blog (care tips, festival ideas, how to wear) | Customer |
| G4 | Festival offers banner | Customer |
| G5 | Size guide for bangles and rings | Customer |
| G6 | Out-of-stock "notify me" | Customer |
| G7 | Share product on WhatsApp | Customer |
| G8 | Invoice download | Customer |
| G9 | English plus one local language | Customer |
| G10 | Call-back or shop-visit request | Customer |
| G11 | Delivery outside the city (service) | Customer |
| G12 | Admin manage offers and home page banner | Admin |
| G13 | Admin send WhatsApp or SMS status messages | Admin |
| G14 | Customer can change offer preference (yes / no) in My Account | Customer |

---

## 7. Frontend Plan

### 7.1 Pages (React)

| Area | Pages |
|---|---|
| Public | Home, Shop, Collections, Collection detail, Product detail, About Us, Blog list, Blog post, Contact, Search results, Size guide |
| Buying | Cart, Checkout, Order success |
| Account | Login, Sign up, My Account, Order history, Wishlist, Invoice |
| Admin | Admin login, Dashboard, Products, Categories, Orders, Enquiries and customers, Offers and banners, Offer messages |

### 7.2 Reusable components

| Component | Used on |
|---|---|
| Header (logo, menu, search, account, cart) | All pages |
| Top strip | All pages |
| Footer | All pages |
| Product card | Home, Shop, Collections, Search |
| Category card | Home, Shop |
| Trust strip | Home |
| Hero banner | Home |
| Best seller slider | Home |
| Newsletter box | Home, Footer |
| Search box | Header, Search page |
| Filter panel | Shop |
| Sort dropdown | Shop |
| Image gallery | Product detail |
| Size selector | Product detail |
| Review list and review form | Product detail |
| Wishlist heart button | Product card, Product detail |
| Add-to-cart button | Product card, Product detail |
| WhatsApp order button | Product detail |
| Quantity stepper | Cart, Product detail |
| Price display (₹) | Everywhere price shows |
| Pincode check box | Product detail, Cart, Checkout |
| Breadcrumb | Shop, Collections, Product |
| Empty state | Cart, Wishlist, Search |
| Toast / message | All actions |
| Admin table + form | All admin pages |
| Language switcher | Header |
| Offer opt-in tick box | Sign up, My Account |
| Offer message composer (title, text, photos, send) | Admin offer messages |

---

## 8. Backend Plan

### 8.1 Database data (Supabase PostgreSQL)

Login is handled by Supabase Auth. Customer and owner passwords are never stored in our own tables. Each login row links to one row in `users`.

**Main tables**

| Table | Columns | Notes |
|---|---|---|
| users | id (uuid, links to Supabase Auth), full_name, phone, email, role (customer / admin), offers_opt_in (yes / no), language, created_at | One row per login. role decides admin access |
| categories | id, name, slug, photo_url, sort_order, is_hidden, created_at | 6 categories |
| products | id, name, code (unique), category_id, type, occasion, metal, price ₹, stock, description, size_options, photo_urls, is_hidden, created_at, updated_at | photo_urls point to Supabase Storage |
| orders | id, user_id, status (placed / packed / shipped / delivered), subtotal ₹, delivery_charge ₹, total ₹, payment_status, pincode, address_id, created_at | One row per order |
| order_items | id, order_id, product_id, product_name, product_code, unit_price ₹, quantity, line_total ₹ | One row per item in an order |
| payments | id, order_id, gateway, gateway_ref, method (UPI / card), amount ₹, status, created_at | No card data saved |
| reviews | id, product_id, user_id, rating, review_text, photo_urls, is_approved, created_at | Reviews with photos |
| wishlist | id, user_id, product_id, created_at | One row per saved item |
| addresses | id, user_id, full_name, phone, line1, line2, city, state, pincode, is_default, created_at | Saved addresses |
| enquiries | id, name, phone, email, message, type (enquiry / call-back / visit), status, created_at | Contact and enquiry form |
| offers | id, title, text, image_url, placement, starts_at, ends_at, is_active, created_at | Banner and festival offers |
| offer_messages | id, title, message, photo_urls, channel (WhatsApp / email), sent_by, sent_count, status, created_at | Owner offer to opted-in customers |
| offer_message_log | id, offer_message_id, user_id, channel, status (sent / failed), sent_at | Who got which offer |

**Extra tables kept from earlier features (still needed)**

| Table | Columns | Notes |
|---|---|---|
| newsletter_subscribers | id, email, created_at | Newsletter sign-up (M13) |
| notify_me | id, product_id, email, phone, created_at | Out-of-stock "notify me" (G6) |
| site_settings | id, delivery_info, return_info, social_links, whatsapp_number, shop_timings, updated_at | Values still To be confirmed |

**How tables connect**

| From | To | Type |
|---|---|---|
| users | Supabase Auth | 1 to 1 |
| categories | products | 1 to many |
| orders | users | many to 1 |
| order_items | orders | many to 1 |
| order_items | products | many to 1 |
| payments | orders | 1 to 1 |
| reviews | products, users | many to 1 |
| wishlist | users, products | many to 1 (unique per pair) |
| addresses | users | many to 1 |
| offer_message_log | offer_messages, users | many to 1 |

**Search**

| Find by | How |
|---|---|
| Jewellery name | PostgreSQL search on `products.name` |
| Jewellery code | Exact / partial match on `products.code` (unique) |
| Speed | Simple index on name and code, plus trigram index for partial words. Free, no extra tool |

**Security (Row Level Security)**

| Rule | Detail |
|---|---|
| Own data only | A customer can read and change only their own orders, order items, wishlist and addresses |
| Public read | Anyone can read products and categories that are not hidden |
| Admin only | Only the admin can add or edit products, prices, stock, categories and offers |
| Service role key | Used only on the server, never in the frontend |
| Offer lists | Only the admin can read the list of customers who agreed to get offers |

### 8.2 APIs (examples)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/products | List with filters, sort, paging |
| GET | /api/products/:id | Product detail |
| GET | /api/search | Find by name and code |
| GET | /api/categories | Category list |
| GET | /api/collections | Collections list |
| POST | Supabase Auth signUp | Create account (email / phone). Also saves the "I want to get offers" tick box |
| POST | Supabase Auth signIn | Login for customer and owner (admin) |
| GET | Supabase Auth session | Keeps user logged in; role is read from the users table |
| GET/POST | /api/cart | Read / update cart |
| POST | /api/orders | Create order |
| POST | /api/payment/verify | Server-side payment confirmation |
| GET | /api/orders/history | Customer orders |
| POST | /api/pincode/check | Delivery check by pincode |
| POST | /api/reviews | Add review |
| POST | /api/enquiries | Send enquiry |
| POST | /api/newsletter | Newsletter sign-up |
| POST | /api/notify-me | Out-of-stock notify |
| GET/POST | /api/offers/opt-in | Read / set customer offer preference (yes / no) |
| POST | /api/admin/offers | Create offer campaign with title, text and jewellery photos |
| POST | /api/admin/offers/send | Send offer campaign to all opted-in customers (WhatsApp or email) |
| GET | /api/admin/offers | List past offer campaigns and send log |
| GET | /api/admin/... | Admin-only routes |

### 8.3 Admin screens

| Screen | Actions |
|---|---|
| Dashboard | See new orders and enquiries |
| Products | Add, edit, hide, price, stock, photos, code |
| Categories | Add, edit, order, hide |
| Orders | See orders, change status, send WhatsApp / SMS status |
| Enquiries and customers | See and manage |
| Offers and banners | Manage home page banner and offers |
| Offer messages | Write offer text, add jewellery photos, choose WhatsApp or email, send to opted-in customers, see send log |

---

## 9. Tech Stack

Monthly cost is left as **To be confirmed** for every row.

| Layer | Tool | Reason | Monthly cost |
|---|---|---|---|
| Frontend | React | Reusable components, good for mobile-first, large community | To be confirmed |
| Backend | Node.js with Express | Same language as frontend, simple and fast for APIs | To be confirmed |
| Database | Supabase PostgreSQL | Relational tables with keys, free tier, one account for DB, login and storage | To be confirmed |
| Login and accounts | Supabase Auth | Handles customer and owner login safely. Role stored in users table | To be confirmed |
| Payment | Indian payment gateway (to be chosen) | Supports UPI and cards for Indian customers | To be confirmed |
| Image storage | Supabase Storage | Stores jewellery photos in a bucket linked to the same Supabase account | To be confirmed |
| Hosting | Cloud hosting (to be chosen) | Public website with HTTPS, good speed | To be confirmed |
| Search | Supabase PostgreSQL search (name + code) | Finds products by name and by jewellery code. Free, no extra tool | To be confirmed |
| WhatsApp messages | WhatsApp Business API provider (to be chosen) | Order and status messages on customers' phones | To be confirmed |
| Offer messages (with images) | WhatsApp provider or email tool (to be chosen) | Sends festival offer + jewellery photos to opted-in customers | To be confirmed |
| SMS (optional) | SMS provider (to be chosen) | Backup for status messages | To be confirmed |

### 9.1 Security rules

| Rule | Detail |
|---|---|
| HTTPS only | All pages served over HTTPS |
| Login | Supabase Auth handles customer and owner logins. We never keep plain passwords |
| Row Level Security (RLS) | Rules in the database. Customers see only their own orders, wishlist and addresses |
| Admin only data | Only the admin can add or edit products, prices, stock, categories and offers |
| Admin-only pages | Separate /admin page with owner login, hidden from customers, protected by login and role check |
| Service role key | Kept on the server only. Never put it in the frontend or in browser code |
| Server-side payment confirmation | Confirm payment on the server, never trust the browser alone |
| No card data saved | Card numbers never stored on our servers or database |
| Backups | Supabase backups (Free plan coverage: To be confirmed, verify on the official site) |
| Keys and secrets | Kept in server-side environment variables, never in frontend |
| Input checks | Validate and reject bad or empty data on the server |
| Offer opt-in only | Offer messages sent only to customers who said yes |

---

## 10. Payment, Delivery and Returns

Every value below is to be confirmed. Nothing is guessed.

| Item | Detail |
|---|---|
| Payment methods | UPI and cards only |
| Cash on delivery | Not allowed |
| Payment gateway | To be confirmed |
| Payment confirmation | Server-side, after gateway response |
| Delivery inside city | Delivery time and charge: To be confirmed |
| Delivery outside city | Area, time and charge: To be confirmed |
| Free delivery above amount | To be confirmed |
| Return window (days) | To be confirmed |
| Return conditions | To be confirmed |
| Refund time | To be confirmed |
| Exchange policy | To be confirmed |
| Order cancellation | To be confirmed |

---

## 11. Content Needed From the Owner

| # | Item | Status |
|---|---|---|
| 1 | Product photos (ready; some need small editing) | Partly ready |
| 2 | Product names | To be confirmed |
| 3 | Jewellery codes | To be confirmed |
| 4 | Product prices (₹) | To be confirmed |
| 5 | Product stock counts | To be confirmed |
| 6 | Logo file | To be confirmed |
| 7 | About Us text (shop story) | To be confirmed |
| 8 | Shop video (for "Watch Our Story") | To be confirmed |
| 9 | Shop address | To be confirmed |
| 10 | Phone number | To be confirmed |
| 11 | WhatsApp number | To be confirmed |
| 12 | Instagram link | To be confirmed |
| 13 | Sravanthi's photo | To be confirmed (placeholder used until then) |
| 14 | Brand kit (exact hex codes, fonts, pictures) | To be confirmed |
| 15 | Delivery, payment and return lines for trust strip | To be confirmed |
| 16 | Local language to add | To be confirmed |
| 17 | Shop timings | To be confirmed |
| 18 | Social media links (other than Instagram) | To be confirmed |
| 19 | Festival offer texts (for offer messages) | To be confirmed |
| 20 | Offer jewellery photos (for offer messages) | To be confirmed |

---

## 12. Success Measures

| # | Measure | Target |
|---|---|---|
| S1 | Online orders per month | To be confirmed |
| S2 | WhatsApp enquiries per month | To be confirmed |
| S3 | Customers outside the city | To be confirmed |
| S4 | Cart to order conversion rate | To be confirmed |
| S5 | Repeat customers | To be confirmed |
| S6 | Newsletter sign-ups | To be confirmed |
| S7 | Average order value (₹) | To be confirmed |
| S8 | Website speed and uptime | To be confirmed |

---

## 13. Build Phases (in order, no dates)

| Phase | Name | What is built | Done when |
|---|---|---|---|
| 1 | Foundation | Project setup, design tokens (colours, fonts, spacing), Header, Top strip, Footer | Home shell looks right at 1440 px and 375 px |
| 2 | Home page | Hero, trust strip, proprietor, categories, best sellers, bottom strip | All 9 home sections built and match design |
| 3 | Catalogue | Shop, Collections, Search, Product detail, filters, sort | Products found by name and by code |
| 4 | Account and wishlist | Sign up, login, My Account, wishlist, addresses | Customer can register and save items |
| 5 | Cart and checkout | Cart, checkout, pincode check, order success | Order created with valid data only |
| 6 | Payment | Gateway integration, server-side confirmation, invoice | UPI and card payment works, no card data saved |
| 7 | Content pages | About Us, Blog, Contact, size guide, offers banner | Pages live with owner content |
| 8 | Admin panel | Login, dashboard, products, categories, orders, enquiries, offers | Owner can run the shop herself |
| 9 | Extras | Reviews with photos, notify me, WhatsApp share, SMS status, local language | Good-to-have list done |
| 10 | Offer messages | Sign-up opt-in tick box, offer composer with jewellery photos, send via WhatsApp or email, send log | Owner can send an offer with photos to opted-in customers |
| 11 | Launch | Security checks, backups, live test | Live site fetched and working |

---

## 14. Cost and Timeline

| Item | Detail |
|---|---|
| Build cost | To be confirmed |
| Monthly running cost | To be confirmed (see Tech Stack table) |
| Payment gateway fees | To be confirmed |
| Delivery cost to customer | To be confirmed |
| Timeline | To be confirmed |
| Freelancer working hours | To be confirmed |

---

## 15. Open Questions

Every item marked To be confirmed above is listed here.

### 15.1 Products and content

| # | Question |
|---|---|
| Q1 | What are the product names? |
| Q2 | What are the jewellery codes? |
| Q3 | What is the price (₹) of each product? |
| Q4 | What are the stock counts for each product? |
| Q5 | Is the logo file available? |
| Q6 | What is the About Us text (shop story)? |
| Q7 | Is the shop video ready for "Watch Our Story"? |
| Q8 | Which product photos still need editing? |
| Q9 | What is the exact brand kit — hex codes, fonts, logo, pictures? |
| Q10 | Which local language should be added? |

### 15.2 Delivery, payment and returns

| # | Question |
|---|---|
| Q11 | Which payment gateway will be used? |
| Q12 | What is the delivery time inside the city? |
| Q13 | What is the delivery time outside the city? |
| Q14 | What is the delivery charge inside the city? |
| Q15 | What is the delivery charge outside the city? |
| Q16 | Which pincodes or areas are served? |
| Q17 | Is there a free delivery amount? If yes, how much? |
| Q18 | How many days is the return window? |
| Q19 | What are the return conditions? |
| Q20 | How long does a refund take? |
| Q21 | What is the exchange policy? |
| Q22 | Can an order be cancelled? Until when? |
| Q23 | What are the exact trust strip lines for Delivery, Secure Payment and Easy Returns? |

### 15.3 Business contact and brand

| # | Question |
|---|---|
| Q24 | What is the shop address (with map pin)? |
| Q25 | What is the phone number? |
| Q26 | What is the WhatsApp number? |
| Q27 | What is the Instagram link? |
| Q28 | What are the other social media links? |
| Q29 | What are the shop timings? |
| Q30 | What is the exact dark navy hex code for headings? |
| Q31 | Which exact serif and sans-serif fonts to use? |
| Q32 | When will Sravanthi's photo be ready? |

### 15.4 Stack, cost and targets

| # | Question |
|---|---|
| Q33 | Is Cloudinary still used for photo compression, or will photos be compressed before upload? |
| Q34 | Which hosting service? |
| Q35 | Which WhatsApp Business API provider? |
| Q36 | Which SMS provider (if needed)? |
| Q37 | What is the monthly cost of each tool? |
| Q38 | What is the total build cost? |
| Q39 | What is the timeline? |
| Q40 | What are the success targets (orders, enquiries, out-of-city customers)? |
| Q41 | Send offer messages by hand with the WhatsApp Business app, or automatically from the site? |
| Q42 | Send offers by WhatsApp, by email, or both? |
| Q43 | Which Supabase plan is used, and does it include backups? |

---

## Document Rules Followed

| Rule | Followed |
|---|---|
| Simple English, short lines | Yes |
| Use headings and tables | Yes |
| No guessed price, date, delivery charge, return days or name | Yes |
| Unknown details written as "To be confirmed" | Yes |
| All unknowns listed in Open Questions | Yes |
