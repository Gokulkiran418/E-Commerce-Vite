import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Fetch cart from back-end on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/cart')
      .then((res) => res.json())
      .then((data) => setCart(data.cart || []))
      .catch((err) => console.error('Error fetching cart:', err));
  }, []);

  const addToCart = (productId) => {
    fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((data) => setCart(data.cart || []))
      .catch((err) => console.error('Error adding to cart:', err));
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                Product ID: {item.productId}, Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => addToCart(1)} // Example: Add product ID 1
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product 1 to Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;