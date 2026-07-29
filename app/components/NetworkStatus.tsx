"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw, FiX } from 'react-icons/fi';
import { useThemeStore } from "@/store/theme.store";

export const NetworkStatus = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showWeakWarning, setShowWeakWarning] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineModal(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineModal(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor connection quality using navigator.connection if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionStatus = () => {
        // Only show warning for very slow connections (2g or slower)
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setShowWeakWarning(true);
        } else {
          setShowWeakWarning(false);
        }
      };

      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus(); // Initial check

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    // Reload the page to retry failed requests
    window.location.reload();
  };

  // Show offline modal (blocking)
  if (showOfflineModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className={isDark ? "bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" : "bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"}>
          <div className="flex flex-col items-center text-center">
            <div className={isDark ? "w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-900/30" : "w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-100"}>
              <FiWifiOff size={32} className="text-red-600" />
            </div>
            
            <h2 className={isDark ? "text-2xl font-bold text-white mb-2" : "text-2xl font-bold text-gray-900 mb-2"}>
              No Internet Connection
            </h2>
            
            <p className={isDark ? "text-slate-300 mb-6" : "text-gray-600 mb-6"}>
              Please check your internet connection and try again.
            </p>

            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full justify-center"
            >
              <FiRefreshCw size={20} />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show weak connection warning (non-blocking, dismissible)
  if (showWeakWarning && isOnline) {
    return (
      <div className="fixed top-4 right-4 z-[100] max-w-sm">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <FiWifi size={18} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">
                Slow internet connection detected
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Some features may be slower than usual.
              </p>
            </div>
            <button
              onClick={() => setShowWeakWarning(false)}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
