import { useState, useEffect } from 'react';

// We store the prompt globally because the browser might fire it before our components mount.
// This is critical since our App.js delays rendering the main UI (including InstallPWA)
// until after Splash Screen and Human Verification.
let globalDeferredPrompt = null;
let isGloballyInstallable = false;
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    globalDeferredPrompt = e;
    isGloballyInstallable = true;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    console.log('INSTALL: Success');
    globalDeferredPrompt = null;
    isGloballyInstallable = false;
    notifyListeners();
  });
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstallable, setIsInstallable] = useState(isGloballyInstallable);

  useEffect(() => {
    const listener = () => {
      setDeferredPrompt(globalDeferredPrompt);
      setIsInstallable(isGloballyInstallable);
    };

    listeners.add(listener);
    // Initial sync in case it changed between render and effect
    listener();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    globalDeferredPrompt = null;
    isGloballyInstallable = false;
    notifyListeners();
  };

  return { isInstallable, installApp };
};
