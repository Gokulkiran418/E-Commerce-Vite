import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-4 fixed w-full top-0 z-20 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold tracking-tight">E-Shop</h1>
        <div className="space-x-6">
          <a href="/" className="text-white hover:text-blue-300 transition-colors duration-200">Home</a>
          <a href="/productpage" className="text-white hover:text-blue-300 transition-colors duration-200">Products</a>
          <a href="/cart" className="text-white hover:text-blue-300 transition-colors duration-200">Cart</a>
          <a href="/checkout" className="text-white hover:text-blue-300 transition-colors duration-200">Checkout</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;