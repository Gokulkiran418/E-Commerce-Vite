import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products and cart on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));

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

  // Calculate totals
  const getProductTotal = (item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? (product.price * item.quantity).toFixed(2) : 0;
  };

  const cartTotal = cart
    .reduce((sum, item) => sum + parseFloat(getProductTotal(item)), 0)
    .toFixed(2);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {cart.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return product ? (
                  <div
                    key={index}
                    className="flex items-center bg-white p-4 rounded-lg shadow-md w-64"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ) : (
                  <p key={index}>Product not found</p>
                );
              })}
            </div>
            {/* Total and Checkout Box */}
            <div className="w-full bg-gray-900 text-white p-6 rounded-lg mt-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              {cart.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return product ? (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{product.name} (Qty: {item.quantity})</span>
                    <span>${getProductTotal(item)}</span>
                  </div>
                ) : null;
              })}
              <div className="flex justify-between font-bold mt-4">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
              <Link to="/checkout">
                <button className="mt-4 bg-blue-300 text-white px-6 py-2 rounded hover:bg-blue-400 w-full md:w-auto">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
       
      </div>
    </div>
  );
};

export default Cart;