# RazorPay Next.js App Router Integration

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

A production-ready UI workflow demonstrating a highly secure, elegantly animated Razorpay testing integration built on top of the modern Next.js 14 App Router, `shadcn/ui`, and Tailwind CSS.

---

## 🚀 Features

- **App Router Powered:** Fully functional Next.js 14 routes.
- **Server-Side Order Generation:** Keeps your `RAZORPAY_KEY_SECRET` completely obfuscated from client-side exploitation. 
- **Premium User Interfaces:** 
  - Dynamic responsive cards built via `shadcn/ui`.
  - Dark-mode, glassmorphic success screens infused with micro-animations.
- **TypeScript Strict Data Fetching:** Strongly casted responses from backend API flows.

---

## 🛠 Project Architecture

This codebase strictly adheres to standard structural patterns.

```bash
📦 my-app
 ┣ 📂 app
 ┃ ┣ 📂 api/create-order     # Secure API Endpoint (POST)
 ┃ ┣ 📂 payments             # Main Checkout Layout
 ┃ ┣ 📜 layout.tsx           # Global HTML Skeleton
 ┃ ┗ 📜 page.tsx             # Root Redirect (to /payments)
 ┣ 📂 components/ui          # Reusable Generic shadcn Primitives
 ┃ ┣ 📜 button.tsx           # Scalable Button Logic
 ┃ ┣ 📜 dialog.tsx           # Modal Portal Triggers
 ┃ ┣ 📜 modal-pricing.tsx    # Custom App Component
 ┃ ┗ ...
 ┣ 📂 lib                    # Generalized Utility Functions
 ┗ 📜 .env.local             # Hidden Payment Secrets
```

---

## ⚙️ Quick Start

```shell
# 1. Clone the repository and navigate inwards
cd my-app

# 2. Install all dependencies
npm install

# 3. Spin up the dev environment
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) inside your browser. The app will immediately redirect you to the main `/payments` interface.

---

## 🔑 Environment Variables
This repository includes a pre-configured `.env.local` testing framework:

```env
# BACKEND ONLY (Used to sign transactions internally)
RAZORPAY_KEY_SECRET=fo6gMoyIFI0FWqXcziu0bO0q

# FRONTEND SHARED (Required for opening the Checkout Widget)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SK1cWHi63pnO29
```

> **Security Note:** Never expose `RAZORPAY_KEY_SECRET` under standard `NEXT_PUBLIC` contexts!

---

## 📝 Production Check-List
If migrating this codebase out of "Test Mode" into a live commercial product:

1. Update `.env.local` to strictly inject `live-keys`.
2. Ensure you calculate and compare validation hashes upon successful client returns using `crypto.createHmac`.
3. Subscribe to Razorpay webhooks (`payment.captured`) via Next.js background workers to accurately maintain persistence if users lose tab connections.