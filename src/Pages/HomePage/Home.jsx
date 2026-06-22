
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import EcosystemImpact from './EcosystemImpact';
import CallToAction from './CallToAction';
import React from 'react'
import EcosystemImpact from './EcosystemImpact'
import CallToAction from './CallToAction'
import Hero from './Hero'

export default function Home() {
  const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
  
  const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden selection:bg-emerald-500 selection:text-white pt-1">
      
      {/* ─── ১. HERO SECTION ─── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Hero />
      </motion.div>

      {/* ─── ২. TRUST & PARTNERS LOGO BANNER ─── */}
      <section className="bg-white py-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Trusted by Verified Global Networks</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-black text-slate-700">UNITED NATIONS</span>
            <span className="text-xl font-black text-slate-700">BRAC COLLAB</span>
            <span className="text-xl font-black text-slate-700">RED CRESCENT</span>
            <span className="text-xl font-black text-slate-700">USAID NETWORK</span>
          </div>
        </div>
      </section>

      {/* ─── ৩. LIVE ECOSYSTEM IMPACT STATS ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <EcosystemImpact />
      </motion.div>

      {/* ─── ৪. CORE MISSION (ABOUT PLATFORM) ─── */}
      <section className="py-20 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-4">
          <span className="inline-block bg-emerald-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full">Our Core Philosophy</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Decentralizing Aid, Maximizing Human Integrity</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            UnityBridge eliminates opaque middlemen layers. By establishing a direct immutable link between sovereign micro-donors, international institutional funds, and verified physical field workers, we create absolute alignment.
          </p>
          <div className="border-l-4 border-emerald-500 pl-4 py-2 italic text-slate-500 text-sm">
            "Transparency is not a feature we add; it is the framework upon which UnityBridge was built."
          </div>
        </motion.div>
        
     
        <div className="relative rounded-3xl overflow-hidden shadow-xl h-80 bg-slate-900 group">
          <img 
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800" 
            alt="Decentralizing Aid and Integrity" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
      </section>

   
      <section className="bg-gradient-to-b from-[#eef4ec] via-white to-slate-50 py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-widest inline-block mb-3">Workflow Pipeline</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">How UnityBridge Operates</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4 mx-auto">01</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">NGOs Post Needs</h3>
              <p className="text-slate-500 text-xs md:text-sm">Audited organizations list explicit project pipelines, budget allocations, and essential community needs.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4 mx-auto">02</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Donors & Volunteers Match</h3>
              <p className="text-slate-500 text-xs md:text-sm">Supporters fund individual items directly or commit real-time service hours to campaigns.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4 mx-auto">03</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Track Milestones</h3>
              <p className="text-slate-500 text-xs md:text-sm">Every single transaction and distribution hour triggers real-time public impact updates.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Immediate Aid Needed</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">Urgent Active Campaigns</h2>
          </div>
          <Link to="/projects" className="text-emerald-600 font-bold mt-4 md:mt-0 hover:underline">View All Campaigns →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Clean Water Infrastructure", ngo: "Savar Water Initiative", raised: "$14,200", target: "$20,000", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400" },
            { title: "Flood Emergency Food Supply", ngo: "Red Crescent East", raised: "$45,000", target: "$50,000", img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400" },
            { title: "Rural Tech & Computer Lab", ngo: "IIT Student Alliance", raised: "$3,500", target: "$10,000", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400" }
          ].map((proj, idx) => (
            <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 w-full bg-slate-200">
                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{proj.ngo}</span>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-1">{proj.title}</h3>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 text-xs font-bold text-slate-600">
                  <span>Raised: {proj.raised}</span>
                  <span className="text-slate-400">Target: {proj.target}</span>
                </div>
                <div className="mt-4">
                  <Link to="/projects" className="block text-center py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors">Contribute Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ৭. TESTIMONIALS (WORDS FROM BENEFICIARIES) ─── */}
      <section className="bg-slate-900 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-black mt-2 mb-12">Voices from the Ecosystem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-300 text-sm leading-relaxed">"As an NGO coordinator, funding reporting used to take 40% of our workflow time. With UnityBridge, audit automation updates milestones automatically."</p>
              <h4 className="font-bold text-white text-sm mt-4">— Rahat Karim, Director of Savar Hope Foundation</h4>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-300 text-sm leading-relaxed">"I always hesitated donating online, doubting where the money actually goes. Seeing my donation map directly to purchase bills changed everything."</p>
              <h4 className="font-bold text-white text-sm mt-4">— Sarah Jenkins, Micro-Donor</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ৮. VOLUNTEER OPPORTUNITIES ─── */}
      <section className="py-20 px-4 max-w-6xl mx-auto bg-white rounded-3xl shadow-xs border border-slate-100 my-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2 inline-block">Human Capital Needed</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Volunteer Work Shifts</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center gap-6 group hover:bg-emerald-50 transition-colors">
            <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250" alt="Tech Lab Shift" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="inline-block bg-rose-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mb-2">Urgent</span>
              <h4 className="font-bold text-slate-800 text-base mb-1">Rural Tech & Computer Lab Support</h4>
              <p className="text-slate-500 text-xs mb-3">Teach basic computer skills to students in rural Savar. Minimum commit: 5 hours.</p>
              <Link to="/volunteer" className="text-emerald-600 font-bold text-sm hover:underline">Join Shift →</Link>
            </div>
          </div>
          <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-center gap-6 hover:bg-emerald-50 transition-colors">
            <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200">
              <img src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=250" alt="Relief Distribution" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="inline-block bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mb-2">Verified</span>
              <h4 className="font-bold text-slate-800 text-base mb-1">Disaster Relief Inventory Logging</h4>
              <p className="text-slate-500 text-xs mb-3">Help log new clean water supply inventories for flood relief. Flexible hours.</p>
              <Link to="/volunteer" className="text-emerald-600 font-bold text-sm hover:underline">Join Shift →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ৯. PLATFORM FEATURES (BENEFITS GRID) ─── */}
      <section className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase text-emerald-600">Engineered Integrity</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">Why Use UnityBridge Ecosystem?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Zero Fraud Protocols", desc: "Multi-party consensus checks ensure no funds can ever bypass preset verification paths." },
            { title: "Direct Bank Routers", desc: "Capital moves directly into vetted merchant accounts reducing external network friction." },
            { title: "Automated Tax Logs", desc: "Instantly retrieve audit-ready financial statements for personal corporate tax deduction reporting." },
            { title: "Sovereign Privacy", desc: "Choose to build public legacy leaderboards or distribute aid with absolute state anonymous discretion." }
          ].map((feat, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100/80 hover:bg-emerald-50/30 transition-colors">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mb-4" />
              <h4 className="font-bold text-slate-800 text-base mb-1">{feat.title}</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ১০. TECHNOLOGY OVERVIEW ─── */}
      <section className="py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-xs my-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="md:col-span-6 space-y-4 relative z-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 inline-block">System Design</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800">Decentralized Trust Architecture</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            UnityBridge eliminates centralized middlemen vulnerabilities. By establishing an automated immutable ledger of aid flow directly mapped to physical milestones, we convert intention into absolute, sovereign verified outcome.
          </p>
        </motion.div>
        <div className="md:col-span-6 relative rounded-3xl overflow-hidden h-80 bg-slate-900 flex items-center justify-center border-l-4 border-emerald-500">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" alt="System Dashboard/Tech Network" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black text-white p-4 bg-black/50 rounded-xl">Immutable Aid Ledger</span>
          </div>
        </div>
      </section>

      {/* ─── ১১. LATEST INSIGHTS & REPORTS (BLOGS) ─── */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-12">Transparency Ledger & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-slate-100">
            <div className="w-full sm:w-32 h-24 bg-slate-200 shrink-0 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Audit paperwork" />
            </div>
            <div>
              <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-500 uppercase">Audit Release</span>
              <h3 className="font-bold text-slate-800 text-sm mt-1 mb-2">Q2 Ecosystem Accountability & Financial Distribution Report</h3>
              <p className="text-xs text-slate-500 line-clamp-2">A complete line-by-line breakdown mapping out 2.4 Million USD across grassroots initiatives.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-slate-100">
            <div className="w-full sm:w-32 h-24 bg-slate-200 shrink-0 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Volunteer with Device" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-50 font-bold px-2 py-0.5 rounded text-emerald-600 uppercase">Tech Innovation</span>
              <h3 className="font-bold text-slate-800 text-sm mt-1 mb-2">Deploying Digital Signatures For Rural Field Volunteers</h3>
              <p className="text-xs text-slate-500 line-clamp-2">How remote verification tokens ensure relief aid maps exactly to the right hands without device access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ১২. ACTION CALL TO ACTION (CTA BANNER) ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="pb-16">
        <CallToAction />
      </motion.div>

    </div>
  );
}