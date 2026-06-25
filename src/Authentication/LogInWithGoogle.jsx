import React from 'react';
import useAuth from '../Hooks/useAuth.jsx';
// import { FcGoogle } from "react-icons/fc";
import image from '../assets/Image/google.png'
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const LogInWithGoogle = () => {
    const location=useLocation()
    const from = location?.state|| '/'
    const {signInGoogle}=useAuth()
    const navigate=useNavigate()
    const handleGoogleSignIn=()=>{
signInGoogle().then( result=>{
   toast.success("Login Successfull")
   navigate(from)
}).catch(error=>{
    toast.error(error.message)  
})
    }
    return (
        <div className='flex justify-center my-3'>
            <div onClick={handleGoogleSignIn} className=' w-6 h-6'>
            <img src={image} alt="google" />

            </div>
        </div>
    );
};

export default LogInWithGoogle;