import React from 'react';

interface HeliosLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HeliosLogo({ className = '', size = 'md' }: HeliosLogoProps) {
  const dimensions = {
    sm: { width: 140, height: 40 },
    md: { width: 180, height: 50 },
    lg: { width: 220, height: 60 },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon SVG from Login.svg */}
      <svg
        width={dimensions.height}
        height={dimensions.height}
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="70" height="70" rx="18" fill="url(#helios_logo_grad)" />
        {/* Heartbeat / Cross Medical Icon */}
        <path
          d="M35 15C23.954 15 15 23.954 15 35C15 46.046 23.954 55 35 55C46.046 55 55 46.046 55 35C55 23.954 46.046 15 35 15ZM37.5 45H32.5V37.5H25V32.5H32.5V25H37.5V32.5H45V37.5H37.5V45Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="helios_logo_grad"
            x1="0"
            y1="0"
            x2="70"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0566DC" />
            <stop offset="1" stopColor="#1CB0A0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Brand Name Text */}
      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-slate-900 text-2xl leading-none">
          Helios
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-teal-600 uppercase mt-0.5">
          Digital Healthcare
        </span>
      </div>
    </div>
  );
}
