import React from 'react';

const ProductCard = ({ product, showNotification }) => {
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
    <div className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
      <p className="text-gray-600 font-medium">${product.price}</p>
      <button
        onClick={addToCart}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;