import React from 'react';
import BackToTopButton from './BackToTopButton';
import Notification from './Notification';

const FloatingUIWrapper = ({ notificationMessage }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-50">
      {notificationMessage && (
        <div className="mb-8">
          <Notification message={notificationMessage} />
        </div>
      )}
      <BackToTopButton />
    </div>
  );
};

export default FloatingUIWrapper;
