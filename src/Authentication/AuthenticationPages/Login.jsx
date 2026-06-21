import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogInWithGoogle from '../LogInWithGoogle';
import useAuth from '../../Hooks/useAuth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';


const Login = () => {
    const location = useLocation()
    const [eye, setEye] = useState(true)
    const { signIn } = useAuth()
    const navigate = useNavigate() 
    const from = location.state?.from?.pathname || "/"
    const { register, handleSubmit } = useForm();   
    const onSubmit = (data) => {
        console.log(data);
        signIn(data?.email, data?.password).then(()=>{
            toast.success("Login success")
               navigate(from, { replace: true })
        })
        .catch(error=>{ toast.error(error.message)
         });
    }
    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <div className="py-6">
                            If you are first in this platform? Please <span className=' text-red-400 font-extrabold'><Link to="/register" className="link link-hover">register</Link></span> first..
                        </div>

                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
                            
                                <div>
                                    <label className="label">Email</label>
                                    <input type="email"   {...register("email")} className="input" placeholder="Email" />
                                </div>
                            
                              
                                <div>
                                    <label className="label">Password</label>
                                   <div className='relative'>
                                                                           <input type={`${eye ? 'password' : 'text'}`}  {...register("password")} className="input" placeholder="Password" />
                                                                           <div onClick={() => setEye(!eye)} className="absolute right-7 top-4">{
                                                                               eye ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>
                                                                           }</div>
                                                                       </div>
                                </div>

                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-neutral mt-4">Login</button>
                                <LogInWithGoogle />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;