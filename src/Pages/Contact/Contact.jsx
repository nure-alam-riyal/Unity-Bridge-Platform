import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const loadingToast = toast.loading("Sending your message...");
    
    console.log("Contact Form Data:", data);
    
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset(); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-24">
      
      {/* Background Blobs */}
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-3">
            Get In Touch
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-5xl">
            We'd Love to <span className="text-emerald-600">Hear From You</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm md:text-base">
            Have questions about projects, donations, or volunteer opportunities? Drop us a message, and our team will connect with you shortly.
          </p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: INFO CARDS (Pure SVG) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Address */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Our Headquarters</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Institute of Information Technology,<br />
                  Jahangirnagar University, Savar, Dhaka-1342
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Email Us Directly</h3>
                <p className="text-slate-600 text-sm font-medium">support@unitybridge.org</p>
                <p className="text-slate-400 text-xs mt-0.5">Response within 24 business hours</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Call Our Hotline</h3>
                <p className="text-slate-600 text-sm font-medium">+880 1711-111111</p>
                <p className="text-slate-400 text-xs mt-0.5">Sat - Thu, 9:00 AM to 6:00 PM</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 md:p-8">
            <h2 className="text-lg font-black text-slate-800 mb-6 pb-2 border-b border-slate-100">Send an Instant Message</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Your Full Name</label>
                <input 
                  type="text" 
                  {...register("name", { required: "Name is required" })}
                  className="input input-bordered bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm border-slate-200" 
                  placeholder="Alex Mercer" 
                />
                {errors.name && <span className="text-[11px] text-rose-500 font-bold mt-1">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    {...register("email", { required: "Email is required" })}
                    className="input input-bordered bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm border-slate-200" 
                    placeholder="alex@example.com" 
                  />
                  {errors.email && <span className="text-[11px] text-rose-500 font-bold mt-1">{errors.email.message}</span>}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-slate-500">Subject Context</label>
                  <input 
                    type="text" 
                    {...register("subject", { required: "Subject is required" })}
                    className="input input-bordered bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm border-slate-200" 
                    placeholder="Inquiry Topic" 
                  />
                  {errors.subject && <span className="text-[11px] text-rose-500 font-bold mt-1">{errors.subject.message}</span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label text-xs font-bold text-slate-500">Detailed Message</label>
                <textarea 
                  rows={4}
                  {...register("message", { required: "Message cannot be blank" })}
                  className="textarea textarea-bordered bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none rounded-xl text-sm h-32 border-slate-200" 
                  placeholder="Type your message details here..."
                />
                {errors.message && <span className="text-[11px] text-rose-500 font-bold mt-1">{errors.message.message}</span>}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="btn bg-slate-900 hover:bg-slate-800 text-white border-none font-bold rounded-xl w-full h-11 shadow-md transition-all"
                >
                  Transmit Message
                </button>
              </div>

            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;