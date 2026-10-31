'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({
  className = '',
  iconClassName = '',
  showText = true,
  showTagline = true,
  tagline = 'Health for Every Home',
  theme = 'auto',
  size = 'md',
}: LogoProps) {
  // Size mapping
  const sizeMap = {
    sm: { icon: 'w-7 h-7', title: 'text-lg', subtitle: 'text-[10px]' },
    md: { icon: 'w-9 h-9', title: 'text-xl', subtitle: 'text-xs' },
    lg: { icon: 'w-11 h-11', title: 'text-2xl', subtitle: 'text-xs' },
    xl: { icon: 'w-14 h-14', title: 'text-3xl', subtitle: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Theme text colors - strictly high contrast so "Aarogya" is never invisible on white backgrounds
  const titleColor = theme === 'dark' ? 'text-white' : 'text-[#16352D]';
  const subColor = theme === 'dark' ? 'text-[#D9F5EA]' : 'text-[#0D9B75]';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Heart + Cross Icon */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconClassName || currentSize.icon}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(13,155,117,0.35)] transition-transform duration-200 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Aarogya Path Logo"
        >
          <defs>
            <linearGradient id="logoHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B286" />
              <stop offset="55%" stopColor="#0D9B75" />
              <stop offset="100%" stopColor="#08694F" />
            </linearGradient>
            <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#08694F" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Smooth curved Heart */}
          <path
            d="M50 86 C20 64 8 45 8 28 C8 13 22 5 35 5 C43 5 48 9 50 14 C52 9 57 5 65 5 C78 5 92 13 92 28 C92 45 80 64 50 86 Z"
            fill="url(#logoHeartGradient)"
          />

          {/* White Medical Cross with soft rounded edges */}
          <g filter="url(#softGlow)">
            <rect x="44" y="24" width="12" height="26" rx="4" fill="#ffffff" />
            <rect x="37" y="31" width="26" height="12" rx="4" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className={`font-extrabold tracking-tight ${currentSize.title} ${titleColor}`}>
            Aarogya <span className="text-[#0D9B75] font-black">Path</span>
          </div>
          {showTagline && (
            <div className={`font-medium tracking-wide mt-0.5 ${currentSize.subtitle} ${subColor}`}>
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
