import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined, HeartFilled, CompassOutlined } from '@ant-design/icons';
import useAuth from '../../Hooks/useAuth';
import useQuerys from '../../Hooks/useQuerys';

const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
`;

export default function Hero() {
  const { user } = useAuth();
  const oneuser = useQuerys({ users: "users" });
  const { email, role } = oneuser[0] || {};

  const isDonorLoggedIn = email && role === 'donor';

  return (
    <>
      <style>{fadeInAnimation}</style>
      
      <section 
        className="w-full py-12 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-[600px] flex items-center justify-center overflow-hidden relative"
        style={{
          backgroundImage: `linear-gradient(rgba(243, 247, 245, 0.92), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1600')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDF4F0] text-[#2E6B4E] border border-[#D5E6DC] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#39835E] animate-pulse" />
              Radical Transparency Ecosystem
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {isDonorLoggedIn ? (
                <>
                  Welcome Back, <span className="text-[#0D623B]">Change-Maker</span>. Ready to Empower?
                </>
              ) : (
                <>
                  Bridging the Gap Between <span className="text-[#0D623B]">Intent</span> and Global <span className="text-[#365CCE]">Impact</span>
                </>
              )}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl font-medium bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/80">
              A secure, decentralized network where donors trace assets down to local milestones, NGOs deploy rapid community lines, and volunteers drive systemic change. Every action is audited and fully meaningful.
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto pt-2">
              
              {isDonorLoggedIn ? (
                <Link to="/projects">
                  <Button 
                    type="primary" 
                    icon={<HeartFilled />} 
                    size="large"
                    className="bg-rose-500 hover:bg-rose-600 border-none text-white font-bold h-13 px-8 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 transition-all transform active:scale-95"
                  >
                    Donate Now
                  </Button>
                </Link>
              ) : (
                <Link to="/projects">
                  <Button 
                    type="primary" 
                    icon={<CompassOutlined />} 
                    size="large"
                    className="bg-slate-900 hover:bg-slate-800 border-none text-white font-bold h-13 px-8 rounded-xl flex items-center justify-center shadow-md transition-all transform active:scale-95 hover:scale-105"
                  >
                    Explore Active Projects
                  </Button>
                </Link>
              )}
              
              <Link to="/projects">
                <Button 
                  type="default" 
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  size="large"
                  className="border-2 border-[#365CCE] text-[#365CCE] hover:text-[#25419A] hover:border-[#25419A] font-bold h-13 px-6 rounded-xl flex items-center justify-center transition-all hover:scale-105 bg-white/90 backdrop-blur-sm"
                >
                  Find Volunteer Work
                </Button>
              </Link>

            </div>
          </div>

          <div className="lg:col-span-5 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 to-blue-100/40 rounded-full blur-3xl -z-10 transform scale-110" />
            
            <div className="grid grid-cols-12 gap-4 items-center w-full">
              <div className="col-span-6 space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white h-48 transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Aid Worker" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white h-36 bg-emerald-900 p-6 text-white flex flex-col justify-end animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
                  <span className="text-2xl font-black tracking-tight">100%</span>
                  <span className="text-xs text-emerald-200 font-medium uppercase tracking-wider">Audited Path</span>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white h-72 transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Community Gathering" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}