'use client';

import { useState, useEffect } from 'react';
import { installPWA, isPWAInstallable } from '@/lib/pwa';

const PWAInstallGuide = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(isInStandaloneMode);

    // Show install prompt only if not installed
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone) {
    return null; // Don't show guide if already installed
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Install Iftar Contest App
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Install our app for a better experience and offline access
          </p>
        </div>
        {showInstallPrompt && (
          <button
            onClick={async () => {
              if (!isPWAInstallable()) {
                console.log('PWA is not installable at this moment');
                return;
              }
              setIsInstalling(true);
              const installed = await installPWA();
              if (!installed) {
                console.log('PWA installation failed or was cancelled');
              }
              setIsInstalling(false);
              setShowInstallPrompt(false);
            }}
            disabled={isInstalling}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PWAInstallGuide;