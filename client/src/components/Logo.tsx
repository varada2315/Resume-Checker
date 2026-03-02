import React from 'react';

export const Logo = ({ className = "w-8 h-8", mood = "neutral" }: { className?: string, mood?: 'confident' | 'neutral' | 'concerned' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="24" fill="currentColor" fillOpacity="0.1" />
      <path 
        d="M30 70 C 30 40, 70 40, 70 70 L 70 75 L 30 75 Z" 
        fill="currentColor" 
      />
      <path 
        d="M40 45 L 60 45 L 55 35 C 55 30, 45 30, 45 35 Z" 
        fill="currentColor" 
      />
      {/* Eyes - Abstract Lines */}
      {mood === 'confident' && (
        <>
          <line x1="42" y1="55" x2="48" y2="52" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="52" x2="58" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {mood === 'neutral' && (
        <>
          <line x1="42" y1="55" x2="48" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="55" x2="58" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {mood === 'concerned' && (
        <>
          <line x1="42" y1="52" x2="48" y2="55" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="55" x2="58" y2="52" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};
