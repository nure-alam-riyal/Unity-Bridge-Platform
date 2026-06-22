import React, { useState } from 'react';
import SideNavigation from './SideNavigation';
import { Outlet } from 'react-router-dom';

export default function NGOLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col md:flex-row relative">
      <header className="md:hidden flex items-center justify-between p-4 bg-base-200 border-b border-base-300 sticky top-0 z-30">
        <span className="font-bold text-slate-700">NGO Panel</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-base-300 text-slate-700"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </header>

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside className={`w-64 fixed top-[55px]  left-0 h-[calc(100vh-100px)] bg-base-200 border-r border-base-300 z-40 transition-transform duration-300 transform md:transform-none 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="h-full " onClick={() => setIsSidebarOpen(false)}>
          <SideNavigation />
        </div>
      </aside>

      <main className="flex-grow md:pl-64 min-h-screen flex flex-col bg-slate-50/50 w-full overflow-x-hidden">
        <div className="p-4 md:p-8 flex-grow">
          <div className="bg-white min-h-[calc(100vh-4rem)] rounded-3xl border border-slate-100 shadow-xs p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}