import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function PremiumHero() {
  return (
    <section className="w-full bg-[#F3F7F5] py-12 px-4 sm:px-6 lg:px-8 min-h-[600px] flex items-center justify-center">
      {/* Main Glass/Card Container */}
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col lg:flex-row min-h-[500px]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 45%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.1) 100%), url('https://images.unsplash.com/photo-1559027615-cd2473385210?auto=format&fit=crop&q=80&w=1000')`,
          backgroundPosition: 'right center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Mobile image overlay backup (ensures layout handles smaller screens gracefully) */}
        <div className="absolute inset-0 bg-white/90 lg:hidden pointer-events-none" />

        {/* Content Column */}
        <div className="relative z-10 flex flex-col justify-center items-start p-8 sm:p-12 lg:p-16 max-w-2xl lg:w-3/5">
          
          {/* Green Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDF4F0] text-[#2E6B4E] border border-[#D5E6DC] rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39835E]" />
            Radical Transparency
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Bridging the Gap Between <br className="hidden sm:inline" />
            <span className="text-[#0D623B]">Intent</span> and Global <span className="text-[#365CCE]">Impact</span>
          </h1>

          {/* Body Text */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mb-8">
            A secure, transparent ecosystem where donors feel secure, NGOs 
            feel empowered, and volunteers feel connected. Every action is 
            tracked, verified, and meaningful.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <Button 
              type="primary" 
              icon={<ArrowRightOutlined />} 
              iconPosition="end"
              size="large"
              className="bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-medium h-12 px-6 rounded-lg flex items-center justify-center shadow-none"
            >
              Donate Now
            </Button>
            
            <Button 
              type="default" 
              size="large"
              className="border-[#365CCE] text-[#365CCE] hover:text-[#25419A] hover:border-[#25419A] font-medium h-12 px-6 rounded-lg flex items-center justify-center"
            >
              Find Volunteer Work
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}