import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-50 select-none">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-xl border border-slate-100 max-w-xs w-full text-center">
        
        {/* Modern Custom Spinning Ring & Pulse Center */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer Rotating Emerald Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#0D623B] animate-spin"></div>
          {/* Inner Pulsing Core */}
          <div className="w-6 h-6 rounded-full bg-[#2A7F62]/20 animate-ping absolute"></div>
          <div className="w-3 h-3 rounded-full bg-[#0D623B] relative"></div>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide m-0">Synchronizing Data</h3>
          <p className="text-[11px] text-slate-400 font-medium m-0 animate-pulse">Please wait a moment...</p>
        </div>

      </div>
    </div>
  );
}