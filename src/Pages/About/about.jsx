import React from 'react';
import { Button } from 'antd';
import { HeartOutlined, UserAddOutlined } from '@ant-design/icons';
import LiveImpactStats from './LiveImpactStats';
import FeaturedProjects from './FeaturedProjects';

export default function About() {
  return (
   <div>
     <section className="w-full bg-white py-12 px-6 md:py-20 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text & CTA Buttons */}
        <div className="flex flex-col justify-center space-y-6 max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Radical Transparency for Global Impact.
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Bridge the gap between intent and impact. See exactly where your donation 
            goes, track verified NGO projects in real-time, and join a global network of 
            volunteers committed to tangible change.
          </p>
          
          {/* Ant Design Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button 
              type="default" 
              icon={<HeartOutlined />} 
              size="large"
              className="flex items-center font-medium border-slate-300 hover:border-[#2A7F62] hover:text-[#2A7F62] h-11 px-5 rounded-md"
            >
              Donate Now
            </Button>
            
            <Button 
              type="default" 
              icon={<UserAddOutlined />} 
              size="large"
              className="flex items-center font-medium border-slate-300 hover:border-[#2A7F62] hover:text-[#2A7F62] h-11 px-5 rounded-md"
            >
              Find Volunteer Work
            </Button>
          </div>
        </div>

        {/* Right Column: Desktop Mockup Frame and Image */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[540px] bg-[#2A7F62] rounded-2xl p-4 pb-0 shadow-xl border border-[#1E5E47]/20">
            {/* Aspect ratio container for the inner image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" 
                alt="Volunteers working in a community garden" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Monitor Stand Graphic Base */}
            <div className="relative w-full h-8 bg-[#2A7F62] rounded-b-2xl flex justify-center">
              <div className="absolute top-0 w-24 h-5 bg-slate-300/80 rounded-b-md mx-auto shadow-inner" />
            </div>
          </div>
        </div>

      </div>
    </section>
    <LiveImpactStats></LiveImpactStats>
    <FeaturedProjects></FeaturedProjects>
   </div>

  );
}