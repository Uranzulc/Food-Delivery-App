# Nine Day Kitchen

Food delivery app: **Next.js 14 + Express + MongoDB**. Follows the plan at https://nine-day-kitchen.pages.dev
(final state of Day 7 plus the Saturday order-provider migration).

## Run it

### 1. Server
```bash
cd server
npm install
cp .env.example .env      # fill MONGO_URI and JWT_SECRET
npm run seed              # admin@food.mn / admin12345 + sample menu
npm run dev               # http://localhost:5000
```

### 2. Client
```bash
cd client
npm install
cp .env.local.example .env.local   # API address, already correct for local use
npm run dev                        # http://localhost:3000
```

Dish images are a pasted URL (any https image link). There is no upload service to set up.

## Try the full flow
1. Sign up at `/signup`, then log in. You land on `/`.
2. In another browser, log in as `admin@food.mn` / `admin12345`. You land on `/admin/dishes`.
3. Admin: add categories and dishes. Customer: add dishes to the cart, open Cart, enter an address, Place order.
4. Admin: `/admin/orders` → change the status to DELIVERED. Customer: `/orders` shows it.

## 15 endpoints
| Route | Access |
| --- | --- |
| POST /auth/sign-up, POST /auth/login | public |
| GET /food-category | public |
| POST, PUT, DELETE /food-category | admin |
| GET /food (?categoryId=), GET /food/:id | public |
| POST /food, PUT /food/:id, DELETE /food/:id | admin |
| POST /order, GET /order/me | token |
| GET /order, PATCH /order/:id | admin |

Category PUT/DELETE take the id in the JSON body: `{ "id": "...", "name": "..." }` / `{ "id": "..." }`.
`POST /order` body: `{ "items": [{ "foodId": "...", "quantity": 2 }], "address": "..." }` (prices are looked up on the server).

## Notes
- The server uses ES modules (`import` / `export`, `"type": "module"` in package.json). `bcryptjs` is used instead of `bcrypt` (same API, no native build step).
- shadcn components (`Button`, `Input`, `Label`, `Select`, `Dialog`) are small hand-written versions in `client/src/components/ui`, so no CLI setup is needed. You can replace them with the real shadcn ones later.
- Everyone who signs up is a USER. Admins come from `npm run seed` only.
- A category that still has dishes can't be deleted (409).
- Order items store the food name and price at order time.
