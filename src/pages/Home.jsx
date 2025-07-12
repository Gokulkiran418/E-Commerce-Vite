import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  const bgRef = useRef(null);
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Loader fade-out shortly after mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      animate(loaderRef.current, {
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInOutQuad',
        complete: () => setLoading(false)
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  // Main animations
  useEffect(() => {
    if (!loading) {
      const colors = ['#0a0a0a', '#1a1a1a', '#0f0a1d', '#0a1d3f', '#1d0f3f', '#3f0a1d'];
      let idx = 0;
      const bgInterval = setInterval(() => {
        const color = colors[idx % colors.length];
        animate(bgRef.current, {
          backgroundColor: color,
          duration: 3000,
          easing: 'easeInOutQuad'
        });
        const circleEl = document.querySelector('.quantum-circle');
        if (circleEl) circleEl.style.boxShadow = `0 0 60px ${color}`;
        idx++;
      }, 3500);

      // Button pulse
      animate('.futuristic-btn', {
        scale: [1, 1.05],
        opacity: [0.85, 1],
        delay: stagger(250),
        easing: 'easeInOutSine',
        duration: 1200,
        direction: 'alternate',
        loop: true
      });

      // Headline and circle initial scale
      animate([textRef.current, '.quantum-circle'], {
        scale: [0.7, 1.15],
        easing: 'easeInOutSine',
        duration: 3000
      });

      // Glow pulse effect on circle
      animate('.quantum-circle', {
        boxShadow: [
          (el) => el.style.boxShadow,
          (el) => el.style.boxShadow.replace('60px', '20px')
        ],
        easing: 'easeInOutSine',
        duration: 3000,
        direction: 'alternate',
        loop: true
      });

      // Horizontal lines move
      animate('.animated-h-line', {
        translateX: ['-100%', '100%'],
        duration: 4000,
        easing: 'linear',
        loop: true
      });
      // Vertical lines move
      animate('.animated-v-line', {
        translateY: ['-100%', '100%'],
        duration: 4000,
        easing: 'linear',
        loop: true
      });

      return () => clearInterval(bgInterval);
    }
  }, [loading]);

  return (
    <>
      {loading && (
        <div ref={loaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-t-cyan-400 border-gray-700 rounded-full animate-spin" />
        </div>
      )}

      <div className="min-h-screen relative overflow-hidden bg-black future-font" ref={bgRef}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1d] via-[#1d0f3f] to-[#0a1d3f] opacity-50 z-0" />

        {/* Decorative neon static lines */}
        <div className="animated-h-line absolute top-1/4 left-0 w-full h-0.5 bg-cyan-400 opacity-20 z-10" />
        <div className="animated-h-line absolute top-1/2 left-0 w-full h-0.5 bg-magenta-400 opacity-20 z-10" />
        <div className="animated-h-line absolute bottom-1/4 left-0 w-full h-0.5 bg-lime-400 opacity-20 z-10" />

        <div className="animated-v-line absolute top-0 left-1/4 w-0.5 h-full bg-purple-400 opacity-20 z-10" />
        <div className="animated-v-line absolute top-0 left-1/2 w-0.5 h-full bg-pink-400 opacity-20 z-10" />
        <div className="animated-v-line absolute top-0 left-3/4 w-0.5 h-full bg-yellow-400 opacity-20 z-10" />

        <div className="relative z-20 flex flex-col items-center text-center text-white pt-24 px-4">
          <h1
            ref={textRef}
            className="text-5xl sm:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-magenta-300"
          >
            Step into the Future
          </h1>
          <p className="text-xl mb-8 max-w-2xl opacity-80">
            Next-gen sports footwear with cutting-edge designs and neon energy.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            {['Products','Cart','Checkout','About'].map((label) => (
              <button
                key={label}
                className="futuristic-btn px-12 py-4 bg-white bg-opacity-20 backdrop-blur-md text-white text-lg font-bold rounded-xl border border-white border-opacity-30 hover:bg-opacity-30 transition"
                onClick={() => navigate(`/${label.toLowerCase()}`)}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="quantum-circle mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-cover bg-center z-20"
            style={{ backgroundImage: "url('/images/quantum.jpg')" }}
          />
        </div>

        <div className="relative z-20 container mx-auto mt-24 px-4">
          <div className="bg-black bg-opacity-70 p-10 rounded-2xl text-white mx-auto max-w-4xl border border-cyan-600">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg opacity-90">
              We blend futuristic aesthetics with unparalleled comfort—powered by sustainable, smart sole technology.
            </p>
          </div>
        </div>

       <Footer />
      </div>
    </>
  );
};

export default Home;
