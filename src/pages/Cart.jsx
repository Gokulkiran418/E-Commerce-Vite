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

        if (!productsRes.ok || !cartRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsRes.json();
        const cartData = await cartRes.json();

        console.log('Products fetched:', productsData);
        console.log('Cart fetched:', cartData);

        setProducts(productsData);
        setCart(cartData.cart || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency ensures fetch on mount

  const addToCart = async (productId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      const data = await res.json();
      console.log('Add to cart response:', data);
      setCart(data.cart || []);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    }
  };

  const getProductTotal = (item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      console.warn(`Product not found for productId: ${item.productId}`);
      return 0;
    }
    return (product.price * item.quantity).toFixed(2);
  };

  const cartTotal = cart
    .reduce((sum, item) => sum + parseFloat(getProductTotal(item) || 0), 0)
    .toFixed(2);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 pt-20">
          <h1 className="text-2xl font-bold mb-4">Cart</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 pt-20">
          <h1 className="text-2xl font-bold mb-4">Cart</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
                    className="flex items-center bg-white p-4 rounded-lg shadow-md w-full sm:w-64"
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
        <button
          onClick={() => addToCart(1)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product 1 to Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;