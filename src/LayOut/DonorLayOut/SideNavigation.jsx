import React from 'react';
import { Button } from 'antd';
import { 
  HiOutlineSquares2X2, 
  HiOutlinePresentationChartLine, 
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';
import { MdVerified } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../Hooks/usePublicAxios';

export default function SideNavigation() {
  const axios=usePublicAxios()
   const { data, isLoading, isError } = useQuery(
 
     {
       queryKey: ['data'],
       queryFn: () => axios.get('users/${id}').then(res => res.data)
     })
   console.log(data)
  // Added accurate routing paths for each navigational item
  const mainNavItems = [
    { label: 'Dashboard', path: '/ngo/dashboard', icon: <HiOutlineSquares2X2 size={20} /> },
    { label: 'Impact Tracking', path: '/ngo/impact-tracking', icon: <HiOutlinePresentationChartLine size={20} /> },
    { label: 'Our Projects', path: '/ngo/projects', icon: <HiOutlineClipboardDocumentList size={20} /> },
    { label: 'Donor Relations', path: '/ngo/donor-relations', icon: <HiOutlineHeart size={20} /> },
    { label: 'Volunteer Hub', path: '/ngo/volunteer-hub', icon: <HiOutlineUserGroup size={20} /> },
  ];

  const bottomNavItems = [
    { label: 'Settings', path: '/ngo/settings', icon: <HiOutlineCog6Tooth size={20} /> },
    { label: 'Support', path: '/ngo/support', icon: <HiOutlineQuestionMarkCircle size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 shadow-sm select-none">
      
      {/* Top Section: Profile & Main Nav */}
      <div className="flex flex-col gap-6">
        
        {/* User Profile Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
              alt="NGO Admin Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 text-base tracking-tight truncate">
              NGO Admin
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
              <MdVerified className="text-[#2A7F62] text-sm flex-shrink-0" />
              <span className="truncate">Verified Partner</span>
            </div>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => 
                `w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 text-left
                ${isActive 
                  ? 'bg-[#EDF4F0] text-[#0D623B]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {/* Context-aware dynamic coloring for the React Icon component */}
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#0D623B]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Action Button */}
        <div className="px-2 pt-2">
          <Button 
            type="primary" 
            size="large"
            className="w-full bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-bold tracking-wide h-11 rounded-xl shadow-sm flex items-center justify-center text-sm p-0"
          >
            <NavLink to="/ngo/launchproject" className="w-full h-full flex items-center justify-center text-white hover:text-white">
              Launch Project
            </NavLink>
          </Button>
        </div>
      </div>

      {/* Bottom Section: Settings & Support */}
      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 text-left
              ${isActive 
                ? 'bg-[#EDF4F0] text-[#0D623B]' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-[#0D623B]' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

    </aside>
  );
}