import React, { useMemo } from 'react';

const ProductCard = ({ product, showNotification }) => {
  const borderColors = [
    'border-cyan-500',
    'border-pink-500',
    'border-purple-500',
    'border-blue-500',
    'border-green-500',
    'border-yellow-500',
    'border-emerald-400'
  ];

  const randomBorder = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * borderColors.length);
    return borderColors[randomIndex];
  }, []);

  const addToCart = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Added to cart:', data);
        showNotification(`${product.name} added to cart`);
      })
      .catch((err) => console.error('Error adding to cart:', err));
  };

  return (
    <div className={`border ${randomBorder} bg-black rounded-xl p-4 shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-lg group`}>
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-500 group-hover:scale-105"
      />
      <h2 className="text-lg font-semibold text-white transition-transform duration-300 group-hover:scale-105">
        {product.name}
      </h2>
      <p className="text-white font-medium transition-transform duration-300 group-hover:scale-105">
        ${product.price}
      </p>
      <button
        onClick={addToCart}
        className="mt-3 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
