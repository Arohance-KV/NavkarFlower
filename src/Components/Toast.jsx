// Toast.jsx
import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Delay the onClose call to allow exit animation
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed top-8 right-4 m-4 p-4 rounded-full shadow-lg z-50 text-white transform transition-all duration-300 ease-in-out ${
        type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
      } ${visible ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {message}
    </div>
  );
};

export default Toast;