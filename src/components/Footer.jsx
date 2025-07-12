import { useNavigate } from 'react-router-dom';
import React from 'react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative z-20 mt-32 py-8 bg-black bg-opacity-80 text-gray-300">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-8 mb-6 opacity-80">
          <button
            onClick={() => navigate('/about')}
            className="hover:text-white"
          >
            About
          </button>
          <a
            href="https://github.com/Gokulkiran418/E-Commerce-Vite.git"
            target="_blank"
            className="hover:text-white"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <p className="opacity-60">&copy; {new Date().getFullYear()} E‑Shop Futuristic</p>
      </div>
    </footer>
  );
};

export default Footer;
