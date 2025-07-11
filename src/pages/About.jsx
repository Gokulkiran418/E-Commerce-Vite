import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import Lottie from 'lottie-react';
import * as THREE from 'three';
import Navbar from '../components/Navbar';

const About = () => {
  const [lottieData, setLottieData] = useState(null);
  const containerRef = useRef();
  const titleRef = useRef();
  const paraRefs = useRef([]);
  const cubeRef = useRef();
  const threeRef = useRef();

  // --- Load your Lottie JSON from /public ---
  useEffect(() => {
    fetch('/pulsingneonheart.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(console.error);
  }, []);

  // --- Anime.js text + cube animations ---
  useEffect(() => {
    animate(titleRef.current, { opacity: [0,1], translateY: [-40,0], duration: 1000, easing: 'easeOutExpo' });
    animate(paraRefs.current, {
      opacity: [0,1],
      translateY: [20,0],
      delay: stagger(200),
      duration: 800,
      easing: 'easeOutExpo'
    });
    animate(cubeRef.current, {
      rotateY: '1turn',
      loop: true,
      duration: 8000,
      easing: 'linear'
    });
  }, []);

  // --- Three.js glowing particles background ---
  useEffect(() => {
    const canvas = document.createElement('canvas');
    threeRef.current.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // particles
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i=0; i<count*3; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // animate
    const tick = () => {
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    // handle resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden about-page">
      <div ref={threeRef} className="absolute inset-0 z-0" />

      <Navbar />

      <div ref={containerRef} className="relative z-10 pt-24 px-6 md:px-20">
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-bold text-center text-cyan-400 mb-12 neon-text drop-shadow-md"
        >
          About E‑Shop
        </h1>

        {/* 3D floating cube with E-Shop text */}
        <div
          ref={cubeRef}
          className="mx-auto mt-16 w-32 h-32"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center">
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(64px)' }}>
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}>
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(64px)' }}>
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center" style={{ transform: 'rotateX(90deg) translateZ(64px)' }}>
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
          <div className="cube-face w-32 h-32 absolute bg-cyan-500/20 border border-cyan-400/50 rounded-lg flex items-center justify-center" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}>
            <span className="text-cyan-300 font-bold text-xl">E-Shop</span>
          </div>
        </div>

        {/* Welcome Section in Blue Card */}
        <div className="mt-12 bg-gradient-to-br from-cyan-800/40 to-pink-900/20 border border-cyan-600 rounded-xl p-8 max-w-5xl mx-auto backdrop-blur-sm shadow-md">
          <div className="max-w-4xl mx-auto space-y-6">
            <p ref={(el) => (paraRefs.current[0] = el)} className="text-lg text-cyan-100 leading-relaxed">
              Welcome to <span className="text-pink-400 font-semibold">E-Shop</span>, your futuristic destination for cutting-edge neon sneakers and style that lights up your life.
            </p>
            <p ref={(el) => (paraRefs.current[1] = el)} className="text-lg text-cyan-100 leading-relaxed">
              At E-Shop, we believe fashion is energy. Every pair of shoes we offer is a fusion of tech, art, and comfort — engineered for movement, designed for awe.
            </p>
            <p ref={(el) => (paraRefs.current[2] = el)} className="text-lg text-cyan-100 leading-relaxed">
              Our mission is to electrify your steps with light-reactive materials, bold futuristic silhouettes, and a shopping experience that feels like tomorrow — today.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-gradient-to-br from-cyan-800/40 to-pink-900/20 border border-cyan-600 rounded-xl p-8 max-w-5xl mx-auto backdrop-blur-sm shadow-md">
          <h2 className="text-3xl text-cyan-300 font-bold mb-6">Why Choose E-Shop?</h2>
          <ul className="list-disc list-inside text-cyan-200 space-y-2 pl-2">
            <li>👟 Neon-powered, futuristic sneakers</li>
            <li>🚀 Seamless, fast, and secure checkout experience</li>
            <li>🎁 Limited-edition drops every month</li>
            <li>🧠 AI-curated recommendations based on your vibe</li>
            <li>🌐 Optimized for all devices, with blazing performance</li>
          </ul>
        </div>

        {lottieData && (
          <div className="flex justify-center mb-12">
            <div className="w-52 md:w-64 drop-shadow-cyan-500/50">
              <Lottie animationData={lottieData} loop autoplay />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;