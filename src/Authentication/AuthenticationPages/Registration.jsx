import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import LogInWithGoogle from '../LogInWithGoogle';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import useAuth from '../../Hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../Redux-Toolkit/Slices/userSlice.jsx';

const Registration = () => {
  const updateData = useDispatch();
  const { createUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [eye, setEye] = useState(true);
  const [error, SetError] = useState('');
  const { register, handleSubmit, watch } = useForm();


  const selectedRole = watch("role", "volunteer&donor");

  const onSubmit = (data) => {
    SetError('');
    const { password } = data;

    const passA = /(?=.*[A-Z])/;
    const passa = /(?=.*[a-z])/;
    const pass6 = /(?=.*[0-9])/;
    const special = /(?=.*[@$!%*?&])/;

    if (!passA.test(password)) {
      return toast.error('Password needs at least one uppercase letter');
    }
    if (!passa.test(password)) {
      return toast.error('Password needs at least one lowercase letter');
    }
    if (password.length < 6 || !pass6.test(password)) {
      return toast.error('Password must be at least 6 characters and contain one number');
    }
    if (!special.test(password)) {
      return toast.error('Password needs at least one special character (@$!%*?&)');
    }
    if (password !== data.confirmPassword) {
      return SetError('Passwords do not match');
    }

    const loadingToast = toast.loading("Creating your gateway account...");

    // ─── 🚀 FIREBASE AUTH LOOP ───
    createUser(data?.email, data?.password)
      .then((result) => {

        updateData(setUserData({
          email: data?.email,
          userName: data?.name,
          role: data?.role,
          NIDorBRITH: data?.NIDorBRITH,
          LicenseNumber: data?.LicenseNumber || 'N/A'
        }));

        navigate('/');
        updateProfile(data?.name, "")
          .then(() => {
            toast.dismiss(loadingToast);
            toast.success("Welcome aboard! Registration completed successfully.");
            navigate('/');
          })
          .catch((err) => {
            toast.dismiss(loadingToast);
            console.error(err);
            navigate('/');
          });
      })
      .catch((error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message || "Authentication routing rejected.");
        navigate('/');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center p-4 md:p-10 overflow-hidden relative">


      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">


        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 text-center lg:text-left space-y-4"
        >
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
            Join Unity Bridge
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
            Create Your <br />
            <span className="text-emerald-600">Impact Profile</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto lg:mx-0">
            Already a registered member of our ecosystem? Feel free to cross over to our secure terminal anytime.
          </p>
          <div className="pt-2">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-white shadow-sm border border-slate-100 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all">
              Already have an account? Sign In
            </Link>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 bg-white/80 backdrop-blur-md border border-slate-100 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Full Name</label>
                <input type="text" required {...register("name")} className="input input-bordered bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm text-slate-800" placeholder="John Doe" />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Email Address</label>
                <input type="email" required {...register("email")} className="input input-bordered bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm text-slate-800" placeholder="name@domain.com" />
              </div>
            </div>


            <div className="form-control">
              <label className="label text-xs font-bold text-slate-500">Select Identity Path</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold ${selectedRole === 'volunteer&donar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
                  <input type="radio" {...register("role")} value="volunteer&donor" className="radio radio-xs radio-success" defaultChecked />
                  <span>Volunteer & Donor</span>
                </label>
                <label className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold ${selectedRole === 'donar' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
                  <input type="radio" {...register("role")} value="donar" className="radio radio-xs radio-success" />
                  <span>Only Donor</span>
                </label>
                <label className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold ${selectedRole === 'NGO' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
                  <input type="radio" {...register("role")} value="NGO" className="radio radio-xs radio-success" />
                  <span>NGO Agency</span>
                </label>
              </div>
            </div>


            <div className="form-control">
              <label className="label text-xs font-bold text-slate-500">NID / Birth Registration Number</label>
              <input type="number" required {...register("NIDorBRITH")} className="input input-bordered bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm text-slate-800" placeholder="Ex: 1998xxxxxxxxxxxxx" />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Secure Password</label>
                <div className="relative">
                  <input type={eye ? 'password' : 'text'} required {...register("password")} className="input input-bordered w-full bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm text-slate-800 pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setEye(!eye)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                    {eye ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Confirm Password</label>
                <div className="relative">
                  <input type={eye ? 'password' : 'text'} required {...register("confirmPassword")} className="input input-bordered w-full bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm text-slate-800 pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setEye(!eye)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                    {eye ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                  </button>
                </div>
                {error && <p className="text-[11px] text-rose-500 font-bold mt-1 pl-1">{error}</p>}
              </div>
            </div>


            <div className="form-control pt-2 space-y-3">
              <button type="submit" className="btn bg-slate-900 hover:bg-slate-800 text-white border-none font-bold rounded-xl w-full h-11 shadow-lg shadow-slate-200 transition-all">
                Complete Registration
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-100 w-full absolute z-0" />
                <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">Or Connect Via</span>
              </div>

              <LogInWithGoogle />
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;