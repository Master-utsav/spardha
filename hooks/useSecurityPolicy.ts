'use client';

import { useEffect } from 'react';

const useSecurityProtection = () => {
  useEffect(() => {
    // Disable text selection, copy, cut, and paste
    const disableEvent = (e: Event) => e.preventDefault();

    document.addEventListener('contextmenu', disableEvent); // Disable right-click
    document.addEventListener('selectstart', disableEvent); // Disable text selection
    document.addEventListener('dragstart', disableEvent); // Disable drag & drop
    document.addEventListener('copy', disableEvent); // Disable copying
    document.addEventListener('cut', disableEvent); // Disable cutting
    document.addEventListener('paste', disableEvent); // Disable pasting

    // Disable Developer Tools
    const disableDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || // Disable F12
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl + Shift + I
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl + Shift + J
        (e.ctrlKey && e.key === 'U') // Ctrl + U (view source)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', disableDevTools);

    // Inject CSS to disable text selection via CSS
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableEvent);
      document.removeEventListener('selectstart', disableEvent);
      document.removeEventListener('dragstart', disableEvent);
      document.removeEventListener('copy', disableEvent);
      document.removeEventListener('cut', disableEvent);
      document.removeEventListener('paste', disableEvent);
      window.removeEventListener('keydown', disableDevTools);
      document.head.removeChild(style);
    };
  }, []);
};

export default useSecurityProtection;
