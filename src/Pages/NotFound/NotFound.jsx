import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8 overflow-hidden select-none">
      <div className="text-center max-w-md w-full flex flex-col items-center">
        
        {/* Floating 404 Text */}
        <div className="relative mb-8 group">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent animate-bounce [animation-duration:3s]">
            404
          </h1>
          <div className="w-32 h-3 bg-black/30 mx-auto rounded-full blur-sm animate-pulse [animation-duration:3s] mt-2"></div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Lost in the Matrix?
        </h2>
        <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another coordinate in the universe.
        </p>

        {/* Navigation Button */}
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-[0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;