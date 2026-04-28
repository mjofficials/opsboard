"use client"

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/store';

export default function AppGlobalLoader() {
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const [showLoader, setShowLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [isInitialized]);

  if (!isMounted || !showLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-700 ease-in-out ${isInitialized ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
        }`}
    >
      {/* Premium Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-loader-glow" />

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center space-y-10">
        {/* Advanced Spinner */}
        <div className="relative w-28 h-28">
          {/* Outer Ring - Indigo */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin [animation-duration:1s]" />
          {/* Middle Ring - Purple */}
          <div className="absolute inset-3 rounded-full border-2 border-purple-500/10 border-r-purple-500 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          {/* Inner Ring - Pink */}
          <div className="absolute inset-6 rounded-full border-2 border-pink-500/10 border-b-pink-500 animate-spin [animation-duration:2s]" />

          {/* Center Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          </div>
        </div>

        {/* Typography */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-loader-shimmer" style={{ backgroundSize: '200% auto' }}>
            OpsBoard
          </h1>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <p className="text-xs font-semibold text-muted-foreground/80 tracking-[0.25em] uppercase">
              Initializing Experience
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden bg-muted/20">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loader-shimmer w-full" style={{ backgroundSize: '200% auto' }} />
      </div>
    </div>
  );
}
