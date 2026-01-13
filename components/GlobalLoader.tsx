"use client";

import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds for that premium feeling

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-all duration-1000 animate-in fade-in zoom-in">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Rings */}
        <div className="absolute inset-0 -m-12 animate-pulse transition-opacity duration-1000">
          <div className="absolute inset-0 border-2 border-yellow-500/20 rounded-full animate-ping" />
          <div className="absolute inset-0 border-2 border-yellow-500/10 rounded-full animate-ping duration-1500 delay-300" />
        </div>

        {/* The Coin Icon */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/30 transition-all duration-500 animate-pulse" />
          <div className="relative p-6 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] border-4 border-yellow-200/20 animate-bounce">
            <Coins className="text-white" size={48} strokeWidth={2.5} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-yellow-300 bg-clip-text text-transparent uppercase tracking-[0.2em] animate-pulse">
            Loading Assets
          </h2>
          <div className="flex gap-1 justify-center italic text-zinc-400 text-xs font-medium uppercase tracking-widest">
            <span>Market Live</span>
            <span className="animate-bounce delay-75">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar Style Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-900">
        <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 animate-[loading_2s_ease-in-out_infinite]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
            left: 0%;
          }
          50% {
            width: 100%;
            left: 0%;
          }
          100% {
            width: 0%;
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
