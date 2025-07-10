import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import BackToTopButton from '../components/BackToTopButton';

const ProductPage = ({ showNotification }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const keyword = filter.toLowerCase();
    setFilteredProducts(
      products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(keyword);
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
      })
    );
  }, [filter, products, selectedCategory, priceRange]);

  const categories = ['All', 'Trekking', 'Walking', 'Exclusive', 'Running', 'Sneaker'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Navbar />
        <div className="mt-20 flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 rounded-full animate-ping" style={{ animationDuration: '1.2s' }}></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-600 border-dashed rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 animate-pulse">Chasing down the sneakers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 pt-20">
          <h1 className="text-2xl font-bold mb-4">Products</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 p-2 border rounded-lg shadow"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <select
            className="p-2 border rounded-lg shadow"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm">Min Price</label>
            <input
              type="number"
              className="w-20 p-1 border rounded"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              onBlur={(e) => setPriceRange([parseInt(e.target.value, 10) || 0, priceRange[1]])}
            />
            <label className="text-sm">Max Price</label>
            <input
              type="number"
              className="w-20 p-1 border rounded"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              onBlur={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10) || 0])}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showNotification={showNotification} />
          ))}
        </div>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default ProductPage;
