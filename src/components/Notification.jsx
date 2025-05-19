import React from 'react';

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
      {message}
    </div>
  );
};

export default Notification;