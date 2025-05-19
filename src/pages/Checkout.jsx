import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Checkout = () => {
  const [message, setMessage] = useState('');

  const handleCheckout = () => {
    fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Error during checkout:', err));
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Complete Checkout
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Checkout;