'use client';

import { useTranslation } from '@/lib/i18n';
import { AlertCircle, PhoneCall } from 'lucide-react';

export function DisclaimerBanner() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-amber-50/95 border-b border-amber-200/80 px-3 sm:px-6 py-2 text-slate-800 text-xs sm:text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <p className="font-medium text-amber-950 text-xs sm:text-sm truncate">
            <span className="font-bold underline decoration-amber-500 mr-1.5">
              {t('disclaimer').split(':')[0]}:
            </span>
            {t('disclaimer').split(':')[1] || t('disclaimer')}
          </p>
        </div>

        <a
          href="tel:108"
          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-xs transition-transform active:scale-95 shrink-0"
          aria-label="Call Emergency Ambulance 108"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>आपातकाल 108</span>
        </a>
      </div>
    </div>
  );
}
