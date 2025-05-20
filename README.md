# Sports Shoe E-Commerce Platform
A full-stack e-commerce app for sports shoes, built with React, Vite, Node.js, Express, and Neon PostgreSQL, deployed on Vercel.

## Features
- Browse products with images, names, and prices.
- Add products to a persistent cart.
- View cart with totals and proceed to checkout.
- Responsive design for mobile and desktop.

## Setup
1. Clone: `git clone https://github.com/Gokulkiran418/E-Commerce-Vite.git`
2. Install: `cd ecommerce-platform && npm install`
3. Back-end: `cd api && npm install`
4. Set `.env`: `VITE_API_URL=http://localhost:5000` (front-end), `DATABASE_URL=your-neon-url` (back-end).
5. Run: `npm run dev` (front-end), `npm start` (back-end).
6. Deploy: Configure Vercel with `VITE_API_URL`, `DATABASE_URL`.

## Tech Stack
- Front-end: React, Vite, Tailwind CSS, React Router
- Back-end: Node.js, Express, Neon PostgreSQL
- Deployment: Vercel
