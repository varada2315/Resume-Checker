import React from 'react';

export const Logo = ({ className = "w-8 h-8", mood = "neutral" }: { className?: string, mood?: 'confident' | 'neutral' | 'concerned' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background container */}
      <rect width="100" height="100" rx="24" fill="currentColor" fillOpacity="0.1" />
      
      {/* Abstract Dinosaur Shape */}
      <path 
        d="M25 75 C 25 45, 45 35, 65 35 C 75 35, 80 40, 80 50 L 80 55 C 80 65, 75 75, 55 75 L 25 75 Z" 
        fill="currentColor" 
      />
      
      {/* Head Detail */}
      <path 
        d="M65 35 C 75 35, 82 42, 82 50 L 75 50 C 72 50, 65 45, 65 35 Z" 
        fill="currentColor"
        fillOpacity="0.8"
      />

      {/* Abstract ID Card (Rectangle overlapping the body) */}
      <rect x="35" y="55" width="25" height="18" rx="2" fill="white" fillOpacity="0.9" />
      <rect x="38" y="58" width="19" height="2" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      <rect x="38" y="62" width="12" height="2" rx="0.5" fill="currentColor" fillOpacity="0.3" />
      <circle cx="53" cy="65" r="3" fill="currentColor" fillOpacity="0.4" />

      {/* Eyes based on mood */}
      {mood === 'confident' && (
        <path d="M68 42 Q 72 40 76 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {mood === 'neutral' && (
        <>
          <circle cx="70" cy="44" r="2" fill="white" />
          <circle cx="76" cy="44" r="2" fill="white" />
        </>
      )}
      {mood === 'concerned' && (
        <path d="M68 45 Q 72 47 76 45" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
};
