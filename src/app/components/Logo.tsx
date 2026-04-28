import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
}

export default function Logo({ className = '', size = 'md', inverted = false }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: fork + leaf */}
      <svg width={s.icon} height={s.icon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill={inverted ? 'white' : '#22C55E'} opacity="0.15" />
        <path d="M10 5v6c0 2.2 1.8 4 4 4v12" stroke={inverted ? 'white' : '#22C55E'} strokeWidth="2" strokeLinecap="round" />
        <path d="M10 5v4M13 5v4M7 5v4" stroke={inverted ? 'white' : '#22C55E'} strokeWidth="2" strokeLinecap="round" />
        <path d="M20 5c3 2 4 5 3 10l-1 10" stroke={inverted ? '#F97316' : '#F97316'} strokeWidth="2" strokeLinecap="round" />
        <circle cx="21" cy="9" r="3" fill={inverted ? '#F97316' : '#F97316'} opacity="0.4" />
      </svg>
      <span className={`${s.text} font-bold tracking-tight`}>
        <span style={{ color: inverted ? 'white' : '#22C55E' }}>Bridge</span>
        <span style={{ color: inverted ? 'rgba(255,255,255,0.7)' : '#334155' }}>The</span>
        <span style={{ color: '#F97316' }}>Bite</span>
      </span>
    </div>
  );
}
