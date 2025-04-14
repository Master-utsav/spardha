'use client';

import { useEffect } from 'react';

const useAutoFullScreen = () => {
  const enableFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen mode not supported:', err);
      });
    }
  };

  useEffect(() => {
    const handleClick = () => {
      enableFullScreen();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};

export default useAutoFullScreen;
