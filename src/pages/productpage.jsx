import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import BackToTopButton from '../components/BackToTopButton';
import Notification from '../components/Notification';
import Footer from '../components/Footer';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

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
  const threeRef = useRef(null);

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Three.js neon wireframe cubes background (fullscreen scrollable canvas)
  useEffect(() => {
    const container = threeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '-1';
    container.appendChild(renderer.domElement);

    // Bloom composer
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;
    composer.addPass(bloomPass);

    // Create wireframe cubes
    const cubes = [];
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 20; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      scene.add(cube);
      cubes.push(cube);
    }

    // Animation loop
    const animateScene = () => {
      requestAnimationFrame(animateScene);
      cubes.forEach((cube, idx) => {
        cube.rotation.x += 0.001 + idx * 0.0001;
        cube.rotation.y += 0.001 + idx * 0.0001;
      });
      composer.render();
    };
    animateScene();

    // Handle resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  // Fetch products
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

  // Filtering
  useEffect(() => {
    const keyword = filter.toLowerCase();
    setFilteredProducts(
      products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch   = p.name.toLowerCase().includes(keyword);
        const matchesPrice    = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
      })
    );
  }, [filter, products, selectedCategory, priceRange]);

  // Card intersection animations
  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      setTimeout(() => {
        document.querySelectorAll('.product-card-wrapper').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          observer.observe(el);
        });
      }, 0);
    }
  }, [filteredProducts, isLoading]);

  const categories = ['All', 'Trekking', 'Walking', 'Exclusive', 'Running', 'Sneaker'];

  return (
    <div ref={bgRef} className="min-h-screen bg-black future-font relative flex flex-col">
      <div ref={threeRef} className="z-0" />
      <Navbar />
      <div className="container mx-auto p-4 pt-20 flex-grow relative z-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-20 relative">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card-wrapper">
              <ProductCard product={product} showNotification={triggerNotification} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
        <Notification message={notification} />
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default ProductPage;
