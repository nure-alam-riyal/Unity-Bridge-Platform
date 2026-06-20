import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import useQuerys from '../Hooks/useQuerys';

const NavBar = () => {
  const {user}=useAuth()
  const oneuser=useQuerys({users:"users"})
 const {email,userName,image,role}=oneuser[0]||{}
   
    // 
    const routers = (
  <>
    <li><NavLink to="/">Home</NavLink></li>
    <li><NavLink to="/login">Login</NavLink></li>
    
    {/* 1. Show NGO link if the role matches */}
    {role === 'NGO' && (
      <li><NavLink to="/ngo">NGO</NavLink></li>
    )}
    
    {/* 2. Show Volunteer link if the role matches */}
    {role === 'volunteer&donar' && (
      <li><NavLink to="/volunteer">Volunteer&Donor</NavLink></li>
    )}
     {role === 'admin' && (
      <li><NavLink to="/admin">Admin</NavLink></li>
    )}
     {role === 'donor' && (
       <li><NavLink to="/donor">Donor</NavLink></li>
    )}
    
    <li><NavLink to="/projects">Projects</NavLink></li>
    
   
    <li><NavLink to="/register">Register</NavLink></li>
    <li><NavLink to="/about">About</NavLink></li>
    <li><NavLink to="/contact">Contact</NavLink></li>
  </>
);
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {routers}
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
     {routers}
    </ul>
  </div>
  <div className="navbar-end">
    <div className="flex items-center gap-2">
        { email ?<div className='flex items-center gap-2'  >
            {image ? <img className=' w-8 h-8 rounded-full' src={image} alt={userName} />:<></> }
        <div className=' font-bold text-green-500'>{userName}</div>
        </div>  
        :
        <> 
        <div><button><NavLink to="/login">Login</NavLink></button></div></>}
    </div>
  </div>
</div>
        </div>
    );
};

export default NavBar;