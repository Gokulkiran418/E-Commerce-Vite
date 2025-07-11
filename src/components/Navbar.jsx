import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const logoRef = useRef(null);
  const linkRefs = useRef([]);
  const mobileMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    animate(logoRef.current, {
      translateY: [-10, 0],
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeOutExpo',
    });

    animate(linkRefs.current, {
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: stagger(150),
      duration: 1000,
      easing: 'easeOutExpo',
    });
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      animate(mobileMenuRef.current, {
        height: [0, mobileMenuRef.current.scrollHeight],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad',
      });
    }
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const navLinks = ['Home', 'Products', 'Cart', 'Checkout'];

  return (
    <nav className="bg-black fixed w-full top-0 z-20 shadow-md border-b border-cyan-500">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1
          ref={logoRef}
          className="text-cyan-400 text-2xl font-bold tracking-tight neon-text shadow-cyan-400/20"
        >
          E-Shop
        </h1>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((label, index) => (
            <a
              key={label}
              ref={el => (linkRefs.current[index] = el)}
              href={`/${label === 'Home' ? '' : label.toLowerCase()}`}
              className="text-white hover:text-cyan-300 transition-colors duration-200 text-lg"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-cyan-400 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden overflow-hidden px-4 pb-4 border-t border-cyan-800 bg-black"
        >
          {navLinks.map(label => (
            <a
              key={label}
              href={`/${label === 'Home' ? '' : label.toLowerCase()}`}
              className="block text-white py-2 text-lg hover:text-cyan-300"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
