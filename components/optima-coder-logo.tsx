import React from 'react';

interface OptimaCoderLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function OptimaCoderLogo({ className = '', size = 'md' }: OptimaCoderLogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* 3D Layered background with depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl transform rotate-2 opacity-80 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-700 rounded-2xl shadow-xl transform -rotate-1 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-600 via-indigo-600 to-blue-700 rounded-2xl shadow-lg transform rotate-1 opacity-85"></div>
        
        {/* Main logo container with 3D effect */}
        <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-xl border-2 border-gray-600/40 flex items-center justify-center overflow-hidden shadow-inner">
          {/* Inner glow and depth */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/20 rounded-lg"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-indigo-400/10 via-blue-400/10 to-purple-400/10 rounded-lg"></div>
          
          {/* Artistic calligraphic letters with 3D effect */}
          <div className="relative z-20 flex items-center justify-center">
            {/* Letter O with calligraphic styling */}
            <span className="relative font-serif italic font-bold text-white tracking-tight leading-none transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              {/* 3D shadow layers for depth */}
              <span className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent blur-sm opacity-70 transform translate-x-1 translate-y-1">
                𝒪
              </span>
              <span className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 bg-clip-text text-transparent blur-xs opacity-80 transform translate-x-0.5 translate-y-0.5">
                𝒪
              </span>
              {/* Main letter with gradient */}
              <span className="relative bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent drop-shadow-lg filter brightness-110">
                𝒪
              </span>
              {/* Highlight effect */}
              <span className="absolute top-0 left-0 bg-gradient-to-br from-white/40 via-blue-100/30 to-transparent bg-clip-text text-transparent transform -translate-x-px -translate-y-px">
                𝒪
              </span>
            </span>
            
            {/* Letter C with calligraphic styling */}
            <span className="relative font-serif italic font-bold text-white tracking-tight leading-none transform rotate-2 hover:rotate-0 transition-transform duration-300 ml-1">
              {/* 3D shadow layers for depth */}
              <span className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent blur-sm opacity-70 transform translate-x-1 translate-y-1">
                𝒞
              </span>
              <span className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent blur-xs opacity-80 transform translate-x-0.5 translate-y-0.5">
                𝒞
              </span>
              {/* Main letter with gradient */}
              <span className="relative bg-gradient-to-br from-purple-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg filter brightness-110">
                𝒞
              </span>
              {/* Highlight effect */}
              <span className="absolute top-0 left-0 bg-gradient-to-br from-white/40 via-purple-100/30 to-transparent bg-clip-text text-transparent transform -translate-x-px -translate-y-px">
                𝒞
              </span>
            </span>
          </div>

          {/* Animated decorative elements */}
          <div className="absolute inset-0 opacity-20">
            {/* Floating particles */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-px h-px bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-3 right-3 w-px h-px bg-violet-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            
            {/* Decorative swirls */}
            <div className="absolute top-1 left-1/2 w-2 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-1 right-1/2 w-2 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full transform rotate-45"></div>
          </div>
          
          {/* Subtle inner border highlight */}
          <div className="absolute inset-0 rounded-xl border border-gradient-to-br from-blue-400/20 via-purple-400/20 to-indigo-400/20"></div>
        </div>
        
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
      </div>
    </div>
  );
}
