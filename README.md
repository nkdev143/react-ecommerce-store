# CodeWithNK Store 🛍️

A full-featured, mobile-friendly e-commerce React app for selling developer merchandise: **T-Shirts**, **Hoodies**, and **Mugs**.

## ✨ Features

- **Storefront**: Home page with hero, categories, bestsellers, new arrivals, perks, and newsletter signup
- **Category pages**: Dedicated, filterable/sortable sections for T-Shirts, Hoodies, and Mugs
- **Product detail pages**: Size/color selection, quantity, reviews tab, related products
- **Cart & Wishlist**: Persistent (localStorage-backed) cart drawer and wishlist
- **User Authentication**: Sign up / sign in (hardcoded in localStorage — no backend needed)
- **Checkout flow**: Multi-step (Shipping → Payment → Review → Confirmation)
- **Order history**: Per-user order tracking
- **Admin Dashboard** (admin-only):
  - Overview: revenue, orders, customers, avg order value, top products, inventory by category
  - Product management: add / edit / delete products
  - Order management: view all orders, update order status
  - Customer management: view all registered users
- **Fully responsive / mobile-friendly** design with hamburger nav, mobile cart drawer, etc.

## 🔐 Admin Login

```
Username: admin
Password: Password@99965
```
Enter `admin` in the **Email** field of the sign-in form.

## 🚀 Getting Started

```bash
npm install
npm start
```
App runs at `http://localhost:3000`.

To build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI: Navbar, Footer, ProductCard, AuthModal, CartDrawer, Toast
├── context/            # React Context: AuthContext, CartContext, OrderContext
├── data/               # Static product data (products.js)
├── pages/              # Page-level components (Home, CategoryPage, ProductDetail, Checkout,
│                          Orders, Wishlist, Profile, AdminDashboard, StaticPages)
├── styles/global.css   # Design tokens & global styles
├── App.jsx             # Main app shell / router (state-based, no react-router needed)
└── index.js            # Entry point
```

## 🗄️ Data Persistence

This app uses **localStorage** to simulate a backend — no server required:
- `cwk_users` — registered user accounts
- `cwk_current_user` — currently logged-in user session
- `cwk_cart` / `cwk_wishlist` — cart and wishlist contents
- `cwk_orders` — all placed orders
- `cwk_admin_products` — admin-edited product catalog

To connect to a real backend, replace the logic inside `src/context/*.jsx` with API calls.

## 🎨 Design

Built with a dark hero + purple accent identity (`#7c3aed`), Space Grotesk display type, and Inter body type — tuned specifically for a developer-merch brand. Fully responsive down to small mobile screens.
