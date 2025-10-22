// src/components/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    // Set a timer to automatically close the toast after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    // Clean up the timer if the component is unmounted early
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;