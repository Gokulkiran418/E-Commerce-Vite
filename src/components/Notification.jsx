import React from 'react';

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-md border border-cyan-500 bg-black text-cyan-200 text-sm font-medium backdrop-blur-md animate-fade-in-out transition-all duration-300">
      {message}
    </div>
  );
};

export default Notification;
