import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'full' }) => {
  const sizeMap = {
    sm: { icon: 32, fontMain: 'text-lg', fontSub: 'text-[10px]' },
    md: { icon: 44, fontMain: 'text-2xl', fontSub: 'text-xs' },
    lg: { icon: 60, fontMain: 'text-3xl', fontSub: 'text-sm' },
    xl: { icon: 80, fontMain: 'text-4xl', fontSub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div id="aiden-logo-brand" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Peacock 'A' Vector SVG Icon */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
      >
        {/* Peacock Crest Feather Fan on head */}
        <path
          d="M32 28C30 22 28 16 26 10M32 28C33 21 35 15 37 9M32 28C36 23 40 18 44 14"
          stroke="#E88B23"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="26" cy="9" r="2.5" fill="#E88B23" />
        <circle cx="37" cy="8" r="2.5" fill="#E88B23" />
        <circle cx="44" cy="13" r="2.5" fill="#E88B23" />

        {/* Peacock Head & Beak */}
        <path
          d="M24 35C21 35 18 36.5 16 38L21 40C23 40 26 39 27 37Z"
          fill="#0D3B2B"
        />
        <circle cx="29" cy="33" r="2" fill="#FFFFFF" />
        
        {/* Peacock Head/Neck Curve merging into Left Leg of 'A' */}
        <path
          d="M32 29C35 32 37 36 36 41C34 49 28 53 23 58C16 65 12 74 12 84C12 91 14 96 17 98C22 101 32 94 40 85C48 76 56 62 57 48C57 44 54 39 49 36C42 32 35 33 32 29Z"
          fill="#0D3B2B"
        />

        {/* Golden Peacock Plume forming Right Leg & Crosswing of 'A' */}
        <path
          d="M33 72C42 63 54 53 66 43C74 36 82 29 90 22C92 20 95 19 97 22C99 26 95 32 89 39C80 49 68 59 55 69C44 78 33 87 23 93C32 85 43 78 54 73C67 67 80 63 94 65C98 66 102 68 102 73C102 78 97 84 90 91C80 100 66 107 51 107C41 107 31 103 23 98C30 98 42 93 52 86L33 72Z"
          fill="#E88B23"
        />

        {/* Dark Green Stem Accent forming 'A' Base */}
        <path
          d="M17 98C28 85 41 71 52 57C58 49 62 41 62 33C62 32 60 30 58 31C54 33 49 38 45 44C36 56 25 72 17 88V98Z"
          fill="#0B2B1F"
        />

        {/* Crossbar Accent */}
        <path
          d="M30 73C42 68 55 64 68 60"
          stroke="#0D3B2B"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Text Brand */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-tight">
          <span
            className={`font-black tracking-tight ${currentSize.fontMain} ${
              variant === 'light' ? 'text-white' : 'text-[#0D3B2B]'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Aiden
          </span>
          <span
            className={`font-semibold uppercase tracking-widest ${currentSize.fontSub} ${
              variant === 'light' ? 'text-emerald-200' : 'text-[#0D3B2B]/90'
            }`}
          >
            Travel Solutions
          </span>
        </div>
      )}
    </div>
  );
};
