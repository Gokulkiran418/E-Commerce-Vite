/* src/pages/Cart.jsx */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, cartRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
          fetch(`${import.meta.env.VITE_API_URL}/api/cart`),
        ]);

        if (!productsRes.ok || !cartRes.ok) throw new Error('Failed to fetch data');

        const productsData = await productsRes.json();
        const cartData = await cartRes.json();
        setProducts(productsData);
        setCart(cartData.cart || []);
      } catch (err) {
        setError('Failed to load cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductTotal = (item) => {
    const product = products.find(p => p.id === item.productId);
    return product ? (product.price * item.quantity).toFixed(2) : '0.00';
  };

  const cartTotal = cart
    .reduce((sum, item) => sum + parseFloat(getProductTotal(item)), 0)
    .toFixed(2);

  if (isLoading) return (
    <><Navbar /><div className="container mx-auto p-4 pt-20"><p>Loading...</p></div></>
  );
  if (error) return (
    <><Navbar /><div className="container mx-auto p-4 pt-20"><p className="text-red-500">{error}</p></div></>
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {cart.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return <p key={idx}>Product not found</p>;
                return (
                  <div key={idx} className="flex items-center bg-white p-4 rounded-lg shadow mb-4">
                    <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">${product.price}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold mt-2">Subtotal: ${getProductTotal(item)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              {cart.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={idx} className="flex justify-between mb-3">
                    <span>{product.name} x {item.quantity}</span>
                    <span>${getProductTotal(item)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
              <Link to="/checkout">
                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;