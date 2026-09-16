import React from 'react';

interface HeliosLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HeliosLogo({ className = '', size = 'md' }: HeliosLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Brand Icon SVG */}
      <svg
        className={`${iconSizes} shrink-0`}
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="70" height="70" rx="20" fill="url(#helios_logo_grad)" />
        {/* Brain diagram icon */}
        <path
          d="M35 18C28.3726 18 23 23.3726 23 30C23 33.1534 24.218 36.022 26.2163 38.1633C25.441 39.5165 25 41.0772 25 42.75C25 47.3063 28.6937 51 33.25 51C34.4578 51 35.6033 50.7402 36.6347 50.2725C37.6661 50.7402 38.8116 51 40.0194 51C44.5757 51 48.2694 47.3063 48.2694 42.75C48.2694 41.0772 47.8284 39.5165 47.0531 38.1633C49.0514 36.022 50.2694 33.1534 50.2694 30C50.2694 23.3726 44.8968 18 38.2694 18C37.1648 18 36.0955 18.1491 35.0847 18.4277C34.0739 18.1491 33.0046 18 31.9 18H35Z"
          fill="none"
        />
        <path
          d="M30 25C26 27 25 31 27 35M43 25C47 27 48 31 46 35M27 37C26 42 29 46 34 46M46 37C47 42 44 46 39 46M35 22V48M28 29A3 3 0 1 1 28 23A3 3 0 0 1 28 29ZM45 29A3 3 0 1 1 45 23A3 3 0 0 1 45 29ZM24 41A2.5 2.5 0 1 1 24 36A2.5 2.5 0 0 1 24 41ZM49 41A2.5 2.5 0 1 1 49 36A2.5 2.5 0 0 1 49 41Z"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="35" cy="30" r="3" fill="white" />
        <circle cx="35" cy="39" r="3" fill="white" />
        <defs>
          <linearGradient
            id="helios_logo_grad"
            x1="0"
            y1="0"
            x2="70"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0091FF" />
            <stop offset="1" stopColor="#0066D6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Brand Name Text */}
      <span className={`font-[850] tracking-tight text-[#0d2946] ${textSizes} leading-none`}>
        Helios
      </span>
    </div>
  );
}

