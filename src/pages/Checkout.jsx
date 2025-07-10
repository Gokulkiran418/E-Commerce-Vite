import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '../components/Navbar';
import { animate } from 'animejs';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, cartRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
          fetch(`${import.meta.env.VITE_API_URL}/api/cart`),
        ]);
        const prodJson = await prodRes.json();
        const cartJson = await cartRes.json();
        setProducts(prodJson);
        setCart(cartJson.cart || []);
      } catch {
        setError('Failed to load order summary.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    animate(containerRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: 'easeOutCubic',
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setMessage('Payment successful!');
      fetch(`${import.meta.env.VITE_API_URL}/api/cart/empty`, { method: 'POST' });
      setTimeout(() => navigate('/'), 3000);
    }
    if (params.get('canceled') === 'true') {
      setError('Payment canceled. Please try again.');
    }
  }, [location.search]);

  const getProductTotal = (item) => {
    const product = products.find(p => p.id === item.productId);
    return product ? (product.price * item.quantity).toFixed(2) : '0.00';
  };

  const cartTotal = cart
    .reduce((sum, item) => sum + parseFloat(getProductTotal(item)), 0)
    .toFixed(2);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stripe = await stripePromise;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { sessionId } = await res.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError('Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden relative">
      <Navbar />
      <div ref={containerRef} className="max-w-6xl mx-auto p-4 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">Review & Complete Your Order</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, idx) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return <p key={idx}>Product not found</p>;
              return (
                <div key={idx} className="flex items-center gap-4 bg-gray-900 p-6 rounded-lg shadow-md border border-cyan-500">
                  <img src={product.image_url} alt={product.name} className="w-28 h-28 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                    <p className="text-cyan-300">Price: ${product.price}</p>
                    <p className="text-cyan-300">Qty: {item.quantity}</p>
                    <p className="font-semibold mt-2 text-cyan-200">Subtotal: ${getProductTotal(item)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-cyan-400">
            <h2 className="text-2xl font-bold mb-6 border-b border-cyan-600 pb-4 text-cyan-300">Order Summary</h2>
            <div className="space-y-3">
              {cart.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return product ? (
                  <div key={idx} className="flex justify-between text-white">
                    <span>{product.name} × {item.quantity}</span>
                    <span>${getProductTotal(item)}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4 text-cyan-200">
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={`mt-6 w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Redirecting to Payment...' : 'Pay with Card'}
            </button>
            <p className="text-sm text-cyan-400 mt-2 text-center">Secure payment powered by Stripe</p>

            <div className="mt-6 bg-black border border-yellow-500 p-4 rounded-lg text-sm text-yellow-300">
              <p className="font-semibold mb-2">💳 Stripe Test Payment</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium">Success:</span> 4242 4242 4242 4242 any future expiry, CVC, ZIP, any email, any name
                </li>
                <li>
                  <span className="font-medium">Insufficient funds:</span> 4000 0000 0000 9995 any future expiry, CVC, ZIP, any email, any name
                </li>
                <li>
                  <span className="font-medium">Card declined:</span> 4000 0000 0000 0002 any future expiry, CVC, ZIP, any email, any name
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
