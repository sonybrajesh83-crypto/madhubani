# SHARDA MADHUBANI PAINTINGS

E-commerce atelier for Madhubani paintings and hand-painted sarees.

**Artist & Founder:** Sharda Jha  
**Co-founder:** Ayush Aryan

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite
- Razorpay (demo mode until live keys are added)
- Motion animations + generative Madhubani SVG art
- In-app chat + WhatsApp handoff + help chatbot

## Quick start

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shardamadhubani.com | admin123 |
| Customer | collector@example.com | collector123 |

## Features

### Customer
- Shop paintings & Madhubani sarees
- Customize Studio (size, frame, palette, borders, dedication, notes, reference upload, motif play)
- Cart, checkout, Razorpay payment
- Auto-generated Customer IDs (`CUST-XXXXXX`) and Product IDs (`PROD-XXXXXX`)
- Reviews after purchase
- Live studio chat + WhatsApp
- Floating help chatbot

### Admin (`/admin`)
- Dashboard
- Add / update / delete products & prices
- Add categories
- Accept & manage orders
- View customer details
- Reply to customer chats

## Razorpay

Set in `.env`:

```
RAZORPAY_KEY_ID=rzp_live_or_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_or_test_xxx
DEMO_PAYMENT_MODE=false
```

While `DEMO_PAYMENT_MODE=true`, checkout completes without live Razorpay credentials.
