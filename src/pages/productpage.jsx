import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import BackToTopButton from '../components/BackToTopButton';
import { animate } from 'animejs';
import Notification from '../components/Notification';
import Footer from '../components/Footer';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [notification, setNotification] = useState('');
  const bgRef = useRef(null);
  const cardRefs = useRef([]);

  // Handler renamed to avoid shadowing
  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  useEffect(() => {
    const colors = ['#000000','#222831', '#000000'];
    let idx = 0;
    const bgInterval = setInterval(() => {
      animate(bgRef.current, {
        backgroundColor: colors[idx % colors.length],
        duration: 4000,
        easing: 'easeInOutQuad'
      });
      idx++;
    }, 4500);
    return () => clearInterval(bgInterval);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const keyword = filter.toLowerCase();
    const newFiltered = products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(keyword);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
    setFilteredProducts(newFiltered);
  }, [filter, products, selectedCategory, priceRange]);

  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animate(entry.target, {
                opacity: [0, 1],
                translateY: [20, 0],
                easing: 'easeOutQuad',
                duration: 800
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 }
      );
      setTimeout(() => {
        document.querySelectorAll('.product-card-wrapper').forEach(el => observer.observe(el));
      }, 0);
    }
  }, [filteredProducts, isLoading]);

  const categories = ['All', 'Trekking', 'Walking', 'Exclusive', 'Running', 'Sneaker'];

  if (isLoading) {
  return (
    <div className="min-h-screen flex flex-col bg-black future-font" ref={bgRef}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-cyan-300 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-pink-300 border-dashed rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-white animate-pulse">Chasing down the sneakers...</p>
      </div>
      <Footer />
    </div>
  );
}

if (error) {
  return (
    <div ref={bgRef} className="min-h-screen bg-black future-font flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 pt-20 text-white flex-grow">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <p className="text-red-500">{error}</p>
      </div>
      <Footer />
    </div>
  );
}

  return (
    <div ref={bgRef} className="min-h-screen relative overflow-hidden bg-black future-font">
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4 text-white">Products</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
             className="flex-1 p-2 border rounded-lg shadow bg-white text-black placeholder-gray-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />

          <select
            className="p-2 border rounded-lg shadow bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-white">Min</label>
            <input
              type="number"
              className="w-20 p-1 border rounded bg-white text-black placeholder-gray-500"
              value={priceRange[0]}
              onChange={e => setPriceRange([+e.target.value || 0, priceRange[1]])}
            />
            <label className="text-sm text-white">Max</label>
            <input
              type="number"
              className="w-20 p-1 border rounded bg-white text-black placeholder-gray-500"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value || 0])}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <div key={product.id} className="opacity-0 product-card-wrapper">
              <ProductCard product={product} showNotification={triggerNotification} />
            </div>
          ))}
        </div>
      </div>
      <Notification message={notification} />
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default ProductPage;
