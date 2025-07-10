import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Notification from './components/Notification';
import ProductPage from './pages/productpage';

function App() {
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden relative">
      <Router>
        {/* Notification fixed on top layer */}
        <div className="z-50 fixed w-full">
          <Notification message={notification} />
        </div>

        {/* Page transitions / routing */}
        <div className="animate-fade-in px-2">
          <Routes>
            <Route path="/" element={<Home showNotification={showNotification} />} />
            <Route path="/products" element={<ProductPage showNotification={showNotification} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
