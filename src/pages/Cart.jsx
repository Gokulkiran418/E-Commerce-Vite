import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Trash2 } from 'lucide-react';
import { animate } from 'animejs';
import Footer from '../components/Footer';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartRef = useRef(null);
  const emptyRef = useRef(null);
  const btnRef = useRef(null);
  const navigate = useNavigate();

  const cartId = useRef(localStorage.getItem('cartId'));
  if (!cartId.current) {
    cartId.current = crypto.randomUUID();
    localStorage.setItem('cartId', cartId.current);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, cartRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
          fetch(`${import.meta.env.VITE_API_URL}/api/cart?cartId=${cartId.current}`),
        ]);
        if (!productsRes.ok || !cartRes.ok) throw new Error('Failed to fetch data');
        setProducts(await productsRes.json());
        const rawCart = (await cartRes.json()).cart || [];
        const aggregated = Object.values(
          rawCart.reduce((acc, item) => {
            if (acc[item.productId]) {
              acc[item.productId].quantity += item.quantity;
            } else {
              acc[item.productId] = { ...item };
            }
            return acc;
          }, {})
        );
        setCart(aggregated);
      } catch {
        setError('Failed to load cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cart.length > 0 && cartRef.current) {
      animate(cartRef.current, { translateY: [20, 0], opacity: [0, 1], duration: 800, easing: 'easeOutExpo' });
    }
  }, [cart]);

  useEffect(() => {
    if (!isLoading && cart.length === 0) {
      if (emptyRef.current) {
        animate(emptyRef.current, { opacity: [0, 1], duration: 1000, easing: 'easeInOutSine' });
      }
      if (btnRef.current) {
        animate(btnRef.current, { scale: [0.9, 1.05], duration: 800, easing: 'easeOutBack' });
      }
    }
  }, [isLoading, cart.length]);

  const getProductTotal = (item) => {
    const product = products.find(p => p.id === item.productId);
    return product ? (product.price * item.quantity).toFixed(2) : '0.00';
  };

  const handleDelete = async (productId) => {
    const itemRef = document.getElementById(`cart-item-${productId}`);
    if (itemRef) {
      await animate(itemRef, { opacity: [1, 0], scale: [1, 0.8], duration: 400, easing: 'easeInOutQuad' });
    }

    setCart(prev => prev.filter(item => item.productId !== productId));

    await fetch(`${import.meta.env.VITE_API_URL}/api/cart/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, cartId: cartId.current })
    });
  };

  const updateQuantity = async (productId, delta) => {
    let updatedQty = 1;

    const newCart = cart.map(item => {
      if (item.productId === productId) {
        updatedQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: updatedQty };
      }
      return item;
    });

    setCart(newCart);

    await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: updatedQty, cartId: cartId.current })
    });
  };

  const handleCheckout = async () => {
    await animate(btnRef.current, { scale: [1, 1.05, 1], duration: 400, easing: 'easeInOutSine' });
    navigate('/checkout');
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(getProductTotal(item)), 0).toFixed(2);

if (isLoading) {
  return (
    <div className="min-h-screen flex flex-col bg-black future-font" ref={cartRef}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-cyan-300 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-pink-300 border-dashed rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-white animate-pulse">Loading cart...</p>
      </div>
      <Footer />
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen flex flex-col bg-black future-font">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
      <Footer />
    </div>
  );
}

if (cart.length === 0) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col future-font" ref={emptyRef}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-cyan-300 mb-6">Your cart is empty</p>
          <button
            ref={btnRef}
            onClick={() => navigate('/products')}
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-transform hover:scale-105"
          >
            Add Products
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative future-font">
      <Navbar />
      <div className="container mx-auto p-4 pt-24 future-font" ref={cartRef}>
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {cart.map((item) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={item.productId} id={`cart-item-${item.productId}`} className="flex items-center bg-[#111] p-4 rounded-lg mb-4 border border-cyan-500">
                  <img src={product.image_url} alt={product.name} className="w-24 h-24 rounded mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg text-cyan-300 font-semibold">{product.name}</h3>
                    <p className="text-cyan-400">${product.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 bg-gray-700 rounded">-</button>
                      <p className="text-white">Qty: {item.quantity}</p>
                      <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 bg-gray-700 rounded">+</button>
                    </div>
                    <p className="text-cyan-200 font-bold mt-1">Subtotal: ${getProductTotal(item)}</p>
                  </div>
                  <button onClick={() => handleDelete(item.productId)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="bg-[#111] p-6 rounded-lg border border-pink-500">
            <h2 className="text-2xl font-bold text-pink-300 mb-4">Order Summary</h2>
            {cart.map((item) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={item.productId} className="flex justify-between text-white mb-2">
                  <span>{product.name} x {item.quantity}</span>
                  <span>${getProductTotal(item)}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-xl font-bold text-cyan-200 border-t pt-4 mt-4">
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              ref={btnRef}
              className="mt-6 w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
