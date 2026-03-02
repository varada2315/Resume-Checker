import React from 'react';

export const Logo = ({ className = "w-8 h-8", mood = "neutral" }: { className?: string, mood?: 'confident' | 'neutral' | 'concerned' }) => {
  return (
    <div className={`${className} relative flex items-center justify-center overflow-hidden rounded-xl bg-[#ffedd5]`}>
      <img 
        src="/logo.png" 
        alt="Optosaur Logo" 
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
};
