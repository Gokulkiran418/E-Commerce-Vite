// src/components/Footer.jsx
const Footer = () => (
  <footer className="relative z-20 mt-32 py-8 bg-black bg-opacity-80 text-gray-300">
    <div className="container mx-auto px-4 text-center">
      <div className="flex justify-center gap-8 mb-6 opacity-80">
        <a href="/about" className="hover:text-white">About</a>
      </div>
      <p className="opacity-60">&copy; {new Date().getFullYear()} E‑Shop Futuristic</p>
    </div>
  </footer>
);

export default Footer;
