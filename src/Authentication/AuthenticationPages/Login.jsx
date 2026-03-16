import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit } = useForm();   
    const onSubmit = (data) => {
        console.log(data);
    }
    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Registration now!</h1>
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
                                    <input type="password" className="input" placeholder="Password" />
                                </div>

                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-neutral mt-4">Login</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;