'use client';

import { useEffect, useState } from 'react';

const useScreenshotProtection = () => {
  const [isScreenshotAttempted, setIsScreenshotAttempted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const triggerScreenshotBlock = () => {
      console.warn('⚠️ Screenshot attempt detected!');
      setIsScreenshotAttempted(true);

      // Create an overlay to blur content
      let overlay = document.getElementById('screenshot-block-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'screenshot-block-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex; 
            justify-content: center; 
            align-items: center; 
            backdrop-filter: blur(30px);
            background: rgba(0, 0, 0, 0.7);
            z-index: 999;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
      }

      // Remove overlay after 1 seconds
      setTimeout(() => {
        if (document.getElementById('screenshot-block-overlay') && overlay) {
          document.body.removeChild(overlay);
        }
        setIsScreenshotAttempted(false);
      }, 1000);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' || // PrtScr button
        (e.ctrlKey && e.key === 'p') || // Ctrl + P (Print)
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) || // Mac Screenshot Shortcuts
        (e.altKey && e.key === 'PrintScreen') || // Windows Alt + PrtScr
        (e.ctrlKey && e.shiftKey && e.key === 's') || // Windows Snipping Tool
        (e.metaKey && e.shiftKey && e.key === 's') || // Mac Snipping Tool
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's')
      ) {
        e.preventDefault();
        triggerScreenshotBlock();
      }
    };

    const detectPixelRatioChange = () => {
      if (window.devicePixelRatio !== 1) {
        triggerScreenshotBlock();
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault(); // Block right-click
    const handleCopyCut = (e: ClipboardEvent) => e.preventDefault(); // Block copying content
    const handlePrint = () => triggerScreenshotBlock(); // Block print preview

    // Attach event listeners
    window.addEventListener('keyup', handleKeyUp); // ✅ Changed from keydown to keyup
    window.addEventListener('resize', detectPixelRatioChange);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopyCut);
    window.addEventListener('cut', handleCopyCut);
    window.addEventListener('beforeprint', handlePrint);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', detectPixelRatioChange);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopyCut);
      window.removeEventListener('cut', handleCopyCut);
      window.removeEventListener('beforeprint', handlePrint);
    };
  }, []);

  return { isScreenshotAttempted };
};

export default useScreenshotProtection;
