// Store the installation prompt
let deferredPrompt: any = null;

// Function to check if PWA is installable
export const isPWAInstallable = () => {
  return !!deferredPrompt;
};

const initPWA = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
    // Register service worker
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration.scope);

        // Handle push notifications subscription
        if ('Notification' in window) {
          const status = await Notification.requestPermission();
          if (status === 'granted') {
            try {
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              });
              console.log('Push notification subscription:', subscription);
            } catch (error) {
              console.error('Failed to subscribe to push notifications:', error);
            }
          }
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });

    // Handle PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
  }
};

// Export function to trigger installation
export const installPWA = async () => {
  if (!deferredPrompt) {
    console.log('No installation prompt available');
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Error during PWA installation:', error);
    return false;
  }
};

export default initPWA;