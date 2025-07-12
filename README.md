# 🛸 E-Shop Ecommerce Store

E-Shop is a sleek and immersive ecommerce experience built with **Vite**, **React**, **Anime.js**, and **Stripe**. With real-time product filtering, animated transitions, and a touch of 3D animation using threejs in abot page. Neon PostgreSQL for database and handling cart.

---

## 🚀 Live Demo

Hosted on **Vercel**  
➡️ [Visit the Live Site](https://eshopplatform.vercel.app)

---

## 🧠 Tech Stack

| Layer         | Technology                           |
|--------------|----------------------------------------|
| Frontend     | React 18 + Vite                       |
| Styling      | Tailwind CSS + Custom futuristic theme |
| Animations   | [Anime.js](https://animejs.com)       |
| 3D Graphics  | [Three.js](https://threejs.org) *(About page only)* |
| Backend API  | Express.js (`/api/index.js`)          |
| Payments     | Stripe API (test mode)                |
| Deployment   | Vercel                                 |

---

## ✨ Features

- 🔍 **Live Filtering**: Search, category, and price-range filtering of products
- 🔍 **Database**: Product details, id, cart items, cart quantity, stored in Neon PostgreSQL
- 💳 **Cart + Checkout**: Add to cart, quantity updates, subtotal logic, and **Stripe** integration for secure checkout
- 🧬 **Neon Futuristic Theme**: Responsive UI with a retro-future aesthetic
- 🎞️ **Smooth Animations**: Product fades, page transitions, and animated backgrounds via Anime.js
- 📦 **Optimized Build**: Vite-powered development and blazing-fast production
- 🎮 **3D Animation (Three.js)**: The About page features an interactive neon heart animation powered by Three.js
- 📱 **Mobile Responsive**: Designed to adapt beautifully to all screen sizes

---

## 📂 Project Structure
```
root/
├── api/
│ └── index.js # Backend product + cart APIs
├── public/
│ └── images/ # Product images
│ └── pulsingneonheart.json # 3D animation asset for About page
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── BackToTopButton.jsx
│ │ ├── Footer.jsx
│ │ ├── Navbar.jsx
│ │ ├── Notification.jsx
│ │ └── ProductCard.jsx
│ ├── pages/ # All routes/pages
│ │ ├── About.jsx # Contains Three.js + GSAP animation
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Home.jsx
│ │ └── ProductPage.jsx
│ ├── App.jsx
│ ├── index.css # TailwindCSS + custom styles
│ └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```


---

## 🧪 How It Works

1. **Products API** (`api/index.js`): Returns product list and handles cart CRUD using local state and product data Neon PostgreSQL.
2. **Anime.js**:
   - Horizontal + vertical neon line animation on product & cart pages
   - Element fade-ins on scroll using `IntersectionObserver`
   - Button and cart interactions using scale, opacity, and movement
3. **Three.js**:
   - Renders an animated neon heart on the About page
   - Pulled from `pulsingneonheart.json` using lottie
4. **Stripe**:
   - Products are passed to the Stripe checkout session
   - Success: 4242 4242 4242 4242
   - Low funds: 4000 0000 0000 9995
   - Card declined: 4000 0000 0000 0002

---

## 🛠️ Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Start local API server in another terminal
node api/index.js
```

# Made with ☕ and late-night debugging by Gokul Kiran