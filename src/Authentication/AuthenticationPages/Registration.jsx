import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Registration = () => {
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
                           If you already have an account? Please <span className=' text-red-400 font-extrabold'><Link to="/login" className="link link-hover">Login</Link></span> first..
                        </div>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
                                <div>
                                    <label className="label">Name</label>
                                    <input type="text"   {...register("name")} className="input" placeholder="Name" />
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input type="email"   {...register("email")} className="input" placeholder="Email" />
                                </div>
                                <div className=''>
                                    <label className="label">Select Your Role</label>
                                    <div className='flex gap-4'>

                                        <div>

                                            <input type="radio"  {...register("role")} value='volunteer' className="radio radio-info radio-sm mr-1.5" defaultChecked />
                                            <label htmlFor="">Volunteer</label>
                                        </div>
                                        <div>

                                            <input type="radio"  {...register("role")} value="dontar" className="radio radio-info radio-sm mr-1.5" />
                                            <label htmlFor="">Dontar</label>
                                        </div>
                                        <div>

                                            <input type="radio"  {...register("role")} value='NGO' className="radio radio-info radio-sm mr-1.5" />
                                            <label htmlFor="">NGO</label>
                                        </div>
                                    </div>



                                </div>
                                <div>
                                    <label className="label">NID/BRITH Number</label>
                                    <input type="number" className="input" {...register("NIDorBRITH")} placeholder="NIDorBRITH" />
                                </div>
                                <div>
                                    <label className="label"> License Number</label>
                                    <input type="text" className="input" {...register("LicenseNumber")} placeholder="License Number" />
                                </div>
                                <div>
                                    <label className="label">Password</label>
                                    <input type="password" className="input" placeholder="Password" />
                                </div>

                                <div><a className="link link-hover">Forgot password?</a></div>
                                <button className="btn btn-neutral mt-4">Registration</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;