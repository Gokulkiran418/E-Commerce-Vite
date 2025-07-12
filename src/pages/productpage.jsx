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

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  useEffect(() => {
    const colors = ['#000000', '#222831', '#000000'];
    let idx = 0;
    const bgInterval = setInterval(() => {
      animate(bgRef.current, {
        backgroundColor: colors[idx % colors.length],
        duration: 4000,
        easing: 'easeInOutQuad',
      });
      idx++;
    }, 4500);
    return () => clearInterval(bgInterval);
  }, []);

  useEffect(() => {
    animate('.animated-h-line', {
      translateX: ['-100%', '100%'],
      duration: 4000,
      easing: 'linear',
      loop: true,
    });
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        console.log('Fetched products:', data); // Debug: Log fetched data
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const keyword = filter.toLowerCase();
    const newFiltered = products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(keyword);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
    console.log('Filtered products:', newFiltered); // Debug: Log filtered products
    setFilteredProducts(newFiltered);
  }, [filter, products, selectedCategory, priceRange]);

  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              console.log(`Card ${index} intersecting`); // Debug: Log when card enters viewport
              // Animate the entire card wrapper for visibility
              animate(entry.target, {
                opacity: [0, 1],
                translateY: [50, 0],
                scale: [0.8, 1],
                easing: 'easeOutQuad',
                duration: 800,
                delay: index * 100,
              });
              // Animate child elements
              animate(entry.target.querySelector('.product-image'), {
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.8, 1],
                easing: 'easeOutElastic(1, 0.8)',
                duration: 800,
                delay: index * 100 + 150,
              });
              animate(entry.target.querySelector('.product-title'), {
                opacity: [0, 1],
                translateX: [-20, 0],
                easing: 'easeOutQuad',
                duration: 800,
                delay: index * 100 + 300,
              });
              animate(entry.target.querySelector('.product-price'), {
                opacity: [0, 1],
                translateX: [20, 0],
                easing: 'easeOutQuad',
                duration: 800,
                delay: index * 100 + 450,
              });
              animate(entry.target.querySelector('.product-controls'), {
                opacity: [0, 1],
                translateY: [20, 0],
                easing: 'easeOutQuad',
                duration: 800,
                delay: index * 100 + 600,
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      const wrappers = document.querySelectorAll('.product-card-wrapper');
      console.log('Found wrappers:', wrappers.length); // Debug: Log number of wrappers
      wrappers.forEach((el) => observer.observe(el));
    }
  }, [filteredProducts, isLoading]);

  const categories = ['All', 'Trekking', 'Walking', 'Exclusive', 'Running', 'Sneaker'];

  const animatedLines = (
    <>
      <div className="animated-h-line hidden sm:block absolute top-[5%] left-0 w-full h-0.5 bg-teal-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[10%] left-0 w-full h-0.5 bg-cyan-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[15%] left-0 w-full h-0.5 bg-blue-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[20%] left-0 w-full h-0.5 bg-indigo-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[30%] left-0 w-full h-0.5 bg-magenta-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[40%] left-0 w-full h-0.5 bg-orange-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-lime-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[60%] left-0 w-full h-0.5 bg-green-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[70%] left-0 w-full h-0.5 bg-purple-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute top-[80%] left-0 w-full h-0.5 bg-red-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute bottom-[15%] left-0 w-full h-0.5 bg-violet-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute bottom-[10%] left-0 w-full h-0.5 bg-pink-400 opacity-20 z-10" />
      <div className="animated-h-line hidden sm:block absolute bottom-[5%] left-0 w-full h-0.5 bg-amber-400 opacity-20 z-10" />

      <div className="animated-v-line hidden sm:block absolute top-0 left-[10%] w-0.5 h-full bg-purple-400 opacity-20 z-10" />
      <div className="animated-v-line hidden sm:block absolute top-0 left-[30%] w-0.5 h-full bg-pink-400 opacity-20 z-10" />
      <div className="animated-v-line hidden sm:block absolute top-0 left-1/2 w-0.5 h-full bg-yellow-400 opacity-20 z-10" />
      <div className="animated-v-line hidden sm:block absolute top-0 left-[70%] w-0.5 h-full bg-cyan-400 opacity-20 z-10" />
      <div className="animated-v-line hidden sm:block absolute top-0 right-[10%] w-0.5 h-full bg-magenta-400 opacity-20 z-10" />
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-black future-font relative overflow-hidden" ref={bgRef}>
        {animatedLines}
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
      <div ref={bgRef} className="min-h-screen bg-black future-font flex flex-col relative overflow-hidden">
        {animatedLines}
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
    <div ref={bgRef} className="min-h-screen relative overflow-hidden bg-black future-font flex flex-col">
      {animatedLines}
      <Navbar />
      <div className="container mx-auto p-4 pt-20 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-white">Products</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 p-2 border rounded-lg shadow bg-white text-black placeholder-gray-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="p-2 border rounded-lg shadow bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-white">Min</label>
            <input
              type="number"
              className="w-20 p-1 border rounded bg-white text-black placeholder-gray-500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value || 0, priceRange[1]])}
            />
            <label className="text-sm text-white">Max</label>
            <input
              type="number"
              className="w-20 p-1 border rounded bg-white text-black placeholder-gray-500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value || 0])}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-white text-center col-span-full">No products found.</p>
          ) : (
            filteredProducts.map((product, idx) => (
              <div key={product.id} className="product-card-wrapper z-10">
                <ProductCard product={product} showNotification={triggerNotification} />
              </div>
            ))
          )}
        </div>
      </div>
      <Notification message={notification} />
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default ProductPage;