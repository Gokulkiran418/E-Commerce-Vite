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
    <Router>
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<Home showNotification={showNotification} />} />
        <Route path="/productpage" element={<ProductPage showNotification={showNotification} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;