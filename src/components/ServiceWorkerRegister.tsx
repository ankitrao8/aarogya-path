'use client';

import { WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('ServiceWorker registered:', reg.scope))
          .catch((err) => console.warn('ServiceWorker registration failed:', err));
      });
    }

    // 2. Connectivity Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-amber-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-400 animate-bounce">
      <WifiOff className="w-5 h-5 shrink-0" />
      <div className="text-xs font-bold">
        <span>इंटरनेट बंद है (Offline Mode)</span>
        <p className="text-[11px] font-medium text-amber-100">
          कोर ट्रायज ऑफ़लाइन उपलब्ध है। नेटवर्क आने पर सिंक होगा।
        </p>
      </div>
    </div>
  );
}
