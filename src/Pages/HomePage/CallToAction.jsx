import React from 'react';

export default function CallToAction() {
  return (
    <div className="w-full  max-w-4xl mx-auto p-4">
      <div className="bg-[#f2f8f5] border border-gray-200 rounded-2xl px-6 py-12 md:py-16 text-center shadow-sm">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          Ready to Make a Verified Impact?
        </h2>
        
        {/* Subtitle text */}
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8">
          Join thousands of donors, volunteers, and NGOs building a better world through transparent action.
        </p>
        
        {/* Button Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            type="button"
            className="w-full sm:w-auto bg-[#046A44] hover:bg-[#035436] text-white font-medium px-8 py-3 rounded-md transition-colors duration-200"
          >
            Start Donating
          </button>
          
          <button 
            type="button"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#1D4ED8] font-medium px-8 py-3 rounded-md border border-gray-300 shadow-sm transition-colors duration-200"
          >
            Register as NGO
          </button>
        </div>
      </div>
    </div>
  );
}