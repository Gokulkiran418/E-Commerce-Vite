import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const Navbar = () => {
  const logoRef = useRef(null);
  const linkRefs = useRef([]);

  useEffect(() => {
    // Animate the E-Shop logo
    animate(logoRef.current, {
      translateY: [-10, 0],
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeOutExpo'
    });

    // Animate the links with staggered effect
    animate(linkRefs.current, {
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: stagger(150),
      duration: 1000,
      easing: 'easeOutExpo'
    });
  }, []);

  return (
    <nav className="bg-black p-4 fixed w-full top-0 z-20 shadow-md border-b border-cyan-500">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          ref={logoRef}
          className="text-cyan-400 text-2xl font-bold tracking-tight neon-text shadow-cyan-400/20"
        >
          E-Shop
        </h1>
        <div className="space-x-6">
          {['Home', 'Products', 'Cart', 'Checkout'].map((label, index) => (
            <a
              key={label}
              ref={el => linkRefs.current[index] = el}
              href={`/${label === 'Home' ? '' : label.toLowerCase()}`}
              className="text-white hover:text-cyan-300 transition-colors duration-200 text-lg"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
