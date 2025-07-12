import React, { useState, useMemo } from 'react';

const ProductCard = ({ product, showNotification }) => {
  const [qty, setQty] = useState(1);

  const borderColors = [
    'border-cyan-500',
    'border-pink-500',
    'border-purple-500',
    'border-blue-500',
    'border-green-500',
    'border-yellow-500',
    'border-emerald-400',
  ];

  const randomBorder = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * borderColors.length);
    return borderColors[randomIndex];
  }, []);

  const addToCart = () => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
    fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: qty, cartId }),
    })
      .then((res) => res.json())
      .then((data) => {
        showNotification(`${product.name} (x${qty}) added to cart`);
        setQty(1);
      })
      .catch((err) => console.error('Error adding to cart:', err));
  };

  return (
    <div className={`border ${randomBorder} bg-black rounded-xl p-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-lg group future-font`}>
      <img
        src={product.image_url}
        alt={product.name}
        className="product-image w-full h-48 object-cover rounded-md mb-4 transition-transform duration-500 group-hover:scale-105"
        loading="lazy" // Added for performance
      />
      <h2 className="product-title text-lg font-semibold text-white transition-transform duration-300 group-hover:scale-105">
        {product.name}
      </h2>
      <p className="product-price text-white font-medium mb-2">${product.price}</p>
      <div className="product-controls flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-2 py-1 bg-gray-800 rounded-md text-white hover:bg-gray-700"
          >
            –
          </button>
          <span className="w-8 text-center text-white">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-2 py-1 bg-gray-800 rounded-md text-white hover:bg-gray-700"
          >
            +
          </button>
        </div>
        <button
          onClick={addToCart}
          className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors duration-300"
        >
          Add {qty > 1 ? `x${qty}` : ''} to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;