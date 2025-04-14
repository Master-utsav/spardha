'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const useFullscreenControl = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userExitedRef = useRef(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Function to enter fullscreen
  const enableFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen mode not supported:', err);
      });
    }
    setIsFullscreen(true);
    userExitedRef.current = false;
    setShowModal(false);
  };

  // Function to exit fullscreen (controlled exit)
  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn('Error exiting fullscreen:', err);
      });
    }
    setIsFullscreen(false);
    userExitedRef.current = true; // User intentionally exited
  };

  // Track actual fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenActive = !!document.fullscreenElement;

      // Update the state
      setIsFullscreen(fullscreenActive);

      // If fullscreen was exited but not through our exitFullScreen function
      if (isFullscreen && !fullscreenActive && !userExitedRef.current) {
        console.log('User exited fullscreen - will display modal');
        // Show our custom modal instead of alert
        setShowModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Modal component - this will be rendered in your application
  const FullscreenModal = () => {
    if (!showModal) return null;

    return (
      <div
        ref={modalRef}
        className="z-[2000] h-screen w-[100vw] items-center justify-center overflow-hidden"
      >
        <Dialog open={showModal}>
          <DialogContent className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Fullscreen Required
              </DialogTitle>
            </DialogHeader>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-gray-700 dark:text-gray-300"
            >
              This application requires fullscreen mode. Please click the button
              below to continue.
            </motion.p>

            <motion.button
              onClick={enableFullScreen}
              className="mt-4 w-full rounded-md bg-green-500 px-4 py-2 font-medium text-white transition-all hover:bg-green-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return to Fullscreen
            </motion.button>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Attempt to prevent keyboard shortcuts for exiting
  useEffect(() => {
    const preventExitKeys = (event: KeyboardEvent) => {
      if (isFullscreen) {
        // Try to prevent common exit keys
        if (
          event.key === 'Escape' ||
          event.key === 'F11' ||
          (event.ctrlKey && event.key === 'w') ||
          (event.altKey && event.key === 'F4') ||
          (event.altKey && event.key === 'Tab')
        ) {
          console.log('Attempting to prevent exit key:', event.key);
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
    };

    // Handle visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        isFullscreen &&
        !document.fullscreenElement
      ) {
        console.log('Tab became visible again, showing fullscreen modal');
        setShowModal(true);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', preventExitKeys, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', preventExitKeys, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFullscreen]);

  // Handle initial click to enter fullscreen
  useEffect(() => {
    const handleInitialClick = () => {
      if (!document.fullscreenElement) {
        console.log('Initial click detected, entering fullscreen');
        enableFullScreen();
        // Remove event listener after first click to avoid re-triggering
        document.removeEventListener('click', handleInitialClick);
      }
    };

    document.addEventListener('click', handleInitialClick);

    return () => {
      document.removeEventListener('click', handleInitialClick);
    };
  }, []);

  return {
    isFullscreen,
    enableFullScreen,
    exitFullScreen,
    FullscreenModal,
    showModal,
  };
};

export default useFullscreenControl;
