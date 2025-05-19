import React from 'react';
import Navbar from '../components/Navbar';

const Home = ({ showNotification }) => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      {/* Background image container */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/images/background_img.jpg')` }}
      ></div>
      {/* Content container */}
      <div className="relative z-10 container mx-auto p-4 pt-20 flex flex-col md:flex-row">
        {/* Store info and reviews section */}
        <div className="md:w-1/2 flex flex-col gap-6">
          {/* Store info */}
          <div className="bg-black bg-opacity-70 p-6 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome to E-Shop</h2>
            <p className="text-lg mb-4">
              Discover the ultimate destination for premium sports shoes! At E-Shop, we offer a curated selection of high-performance footwear designed for style and comfort.
            </p>
            <p className="text-lg">
              Enjoy <span className="font-semibold">lightning-fast shipping</span> to get your favorite sneakers delivered to your door in no time. Shop now and step up your game!
            </p>
          </div>
          {/* Customer reviews */}
          <div className="bg-black bg-opacity-70 p-6 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {/* Review 1 */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-2 font-semibold">John S.</span>
                </div>
                <p className="text-sm">
                  Absolutely love my new running shoes! The quality is top-notch, and they arrived in just two days. E-Shop is my go-to for sneakers!
                </p>
              </div>
              {/* Review 2 */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-2 font-semibold">Emma L.</span>
                </div>
                <p className="text-sm">
                  Fantastic experience! The shoes are super comfortable, and the fast shipping was a game-changer. Highly recommend E-Shop!
                </p>
              </div>
              {/* Review 3 */}
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-2 font-semibold">Michael R.</span>
                </div>
                <p className="text-sm">
                  Best shoe store ever! Stylish designs and unbeatable delivery speed. My new kicks are perfect for the gym. 5 stars!
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Empty space on right for desktop */}
        <div className="md:w-1/2"></div>
      </div>
    </div>
  );
};

export default Home;