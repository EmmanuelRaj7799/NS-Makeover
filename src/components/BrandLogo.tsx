import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  compact = false,
  className = '',
}) => {
  const isDarkSurface = variant === 'dark';
  const textColor = isDarkSurface ? '#FAF6F2' : '#231919';
  const subAccent = isDarkSurface ? '#E6CEB5' : '#8C5157';

  return (
    <span className={`inline-flex items-center gap-3 shrink-0 select-none ${className}`}>
      <svg
        width={compact ? 42 : 52}
        height={compact ? 42 : 52}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="nsRoseGold" x1="10" y1="8" x2="72" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EAD3BA" />
            <stop offset="45%" stopColor="#C59B76" />
            <stop offset="100%" stopColor="#9E5E63" />
          </linearGradient>
          <linearGradient id="nsRingStroke" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E6CEB5" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C59B76" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9E5E63" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Double Outer Couture Crest Ring */}
        <circle cx="40" cy="40" r="37" stroke="url(#nsRingStroke)" strokeWidth="1.2" />
        <circle
          cx="40"
          cy="40"
          r="33.5"
          stroke="url(#nsRingStroke)"
          strokeWidth="0.6"
          strokeDasharray="1.8 2.8"
          opacity="0.85"
        />

        {/* Delicate Rose-Gold Crown */}
        <path
          d="M27.5 25.5L25 17.5L32.2 21.5L40 13.5L47.8 21.5L55 17.5L52.5 25.5C48.5 24.4 31.5 24.4 27.5 25.5Z"
          stroke="url(#nsRoseGold)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="url(#nsRoseGold)"
          fillOpacity="0.16"
        />
        <circle cx="40" cy="12" r="1.6" fill="#E6CEB5" />
        <circle cx="24.5" cy="16.4" r="1.25" fill="#C59B76" />
        <circle cx="55.5" cy="16.4" r="1.25" fill="#C59B76" />
        <circle cx="40" cy="21" r="1.2" fill="#E6CEB5" />

        {/* Subtle Left & Right Floral Flourishes */}
        <path
          d="M17.5 46C14 42.5 14 35.5 18 32M15.5 39C17.8 39.2 19.4 40.8 19.6 43"
          stroke="url(#nsRoseGold)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M62.5 46C66 42.5 66 35.5 62 32M64.5 39C62.2 39.2 60.6 40.8 60.4 43"
          stroke="url(#nsRoseGold)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Ornate Serif "NS" Lettering */}
        <text
          x="40"
          y="53"
          textAnchor="middle"
          fill="url(#nsRoseGold)"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontWeight="600"
          fontSize="28"
          letterSpacing="1.5"
        >
          NS
        </text>

        {/* Bottom Filigree Flourish */}
        <path
          d="M25 60.5C31 63.5 49 63.5 55 60.5"
          stroke="url(#nsRoseGold)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="40" cy="64" r="1.3" fill={subAccent} />
      </svg>

      <span
        className="font-display text-lg sm:text-xl font-semibold tracking-[0.14em] whitespace-nowrap shrink-0 transition-colors duration-300"
        style={{ color: textColor }}
      >
        NS MAKEOVER
      </span>
    </span>
  );
};
