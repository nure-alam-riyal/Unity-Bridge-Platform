import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogInWithGoogle from '../LogInWithGoogle';
import useAuth from '../../Hooks/useAuth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const Login = () => {
  const location = useLocation();
  const [eye, setEye] = useState(true);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    signIn(data?.email, data?.password)
      .then(() => {
        toast.success("Welcome back! Login success");
        // navigate(from, { replace: true });
         navigate('/'); 
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-4">
      
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white sm:rounded-3xl shadow-xs border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-screen sm:min-h-[600px]">
        
        {/* 🔒 Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login now!</h1>
              <p className="text-sm text-slate-500 mt-2">
                If you are first in this platform? Please{" "}
                <Link to="/register" className="text-[#0D623B] font-bold hover:underline">
                  register
                </Link>{" "}
                first.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider pl-0.5">Email</label>
                <input 
                  type="email" 
                  {...register("email", { required: true })} 
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm" 
                  placeholder="name@example.com" 
                />
              </div>
              
              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center pl-0.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <a className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input 
                    type={eye ? 'password' : 'text'} 
                    {...register("password", { required: true })} 
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setEye(!eye)} 
                    className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors text-base flex items-center"
                  >
                    {eye ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className="w-full bg-[#0D623B] hover:bg-[#09472A] active:bg-[#06311d] text-white font-semibold py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer mt-2 text-sm tracking-wide"
              >
                Login
              </motion.button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-slate-100 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-widest absolute">Or continue with</span>
              </div>

              {/* Google Login */}
              <div className="w-full">
                <LogInWithGoogle />
              </div>

            </form>
          </div>
        </div>

        {/* 🎨 Right Side: Branding Accent Panel */}
        <div className="hidden md:flex w-1/2 bg-slate-50 border-l border-slate-100 p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square bg-white rounded-full border border-slate-100/60 shadow-2xs pointer-events-none"></div>

          <div className="z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              Unity Bridge Platform
            </span>
          </div>

          <div className="max-w-sm z-10">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              Empowering communities through transparent collaborations.
            </h2>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed">
              Access your personalized dashboard to monitor incoming volunteer tasks, ongoing financial milestones, and upcoming field timelines.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-medium z-10">
            © 2026 Unity Bridge. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;