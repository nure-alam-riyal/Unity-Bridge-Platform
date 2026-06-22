import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import useQuerys from '../Hooks/useQuerys';
import toast from 'react-hot-toast';

const NavBar = () => {
  const { user, LogOut } = useAuth(); 
  const oneuser = useQuerys({ users: "users" });
  const { email, userName, image, role } = oneuser[0] || {};

 
  const handleLogOut = () => {
    if (LogOut) {
      LogOut()
        .then(() => {toast("log out successful")})
        .catch((err) => console.log(err));
    }
  };

 
  const routers = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      
      {role === 'NGO' && (
        <li><NavLink to="/ngo">NGO</NavLink></li>
      )}
      
      {role === 'volunteer&donar' && (
        <li><NavLink to="/volunteer">Volunteer&Donor</NavLink></li>
      )}
      
      {role === 'admin' && (
        <li><NavLink to="/admin">Admin</NavLink></li>
      )}
      
      {role === 'donor' && (
        <li><NavLink to="/donor">Donor Dashboard</NavLink></li>
      )}
      
      <li><NavLink to="/projects">Projects</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/contact">Contact</NavLink></li>
    </>
  );

  return (
    
    <div className="fixed top-0 left-0 w-full z-50 bg-base-100/90 shadow-md backdrop-blur-md border-b border-base-200 transition-all">
      <div className="navbar max-w-7xl mx-auto px-2 md:px-4">
        
        {/* ─── NAVBAR START ─── */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-base-200"
            >
              {routers}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl font-black text-emerald-600 tracking-wide">UnityBridge</Link>
        </div>

        {/* ─── NAVBAR CENTER ─── */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 font-medium">
            {routers}
          </ul>
        </div>

        {/* ─── NAVBAR END ─── */}
        <div className="navbar-end gap-2 md:gap-4">
          
         
          {role === 'donor' && (
            <Link 
              to="/projects" 
              className="btn btn-sm md:btn-md bg-rose-500 hover:bg-rose-600 text-white border-none font-bold rounded-xl shadow-md transition-transform active:scale-95"
            >
              💖 Donate
            </Link>
          )}

          
          {user?.email ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-emerald-500 p-0.5">
                <div className="w-9 rounded-full bg-slate-200">
                  {image ? (
                    <img src={image} alt={userName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-emerald-600 bg-emerald-50">
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-56 border border-base-200 space-y-1"
              >
                <div className="px-3 py-2 border-b z-50 border-base-200 mb-1">
                  <p className="font-bold text-sm text-base-content truncate">{userName}</p>
                  <p className="text-xs text-slate-400 truncate">{email}</p>
                  <span className="badge badge-success badge-xs py-1.5 px-2 text-[10px] font-bold text-white mt-1.5 uppercase">
                    {role}
                  </span>
                </div>
                
                {/* <li>
                  <Link to="/donor" className="py-2">My Dashboard</Link>
                </li> */}
                
                <li>
                  <button 
                    onClick={handleLogOut} 
                    className="py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-sm md:btn-md bg-slate-900 hover:bg-slate-800 text-white border-none font-bold rounded-xl px-4"
            >
              Sign In
            </Link>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default NavBar;