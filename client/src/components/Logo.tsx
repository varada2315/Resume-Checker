import React from 'react';

export const Logo = ({ className = "h-10 w-auto", mood = "neutral" }: { className?: string, mood?: 'confident' | 'neutral' | 'concerned' }) => {
  return (
    <img 
      src="/logo.png" 
      alt="Optosaur Logo" 
      className={`${className} object-contain`}
    />
  );
};
