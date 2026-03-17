import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import LogInWithGoogle from '../LogInWithGoogle';
// import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import useAuth from '../../Hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../Redux-Toolkit/Slices/userSlice.jsx';



const Registration = () => {
    const updateData=useDispatch()
    const { createUser } = useAuth()
    const navigate = useNavigate()
    const [eye, setEye] = useState(true)
    const [error, SetError] = useState('')
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {

        const { password } = data;
        const passA = /(?=.*[A-Z])/
        const passa = /(?=.*[a-z])/
        const pass6 = /(?=.*[0-9])/
        const special = /(?=.*[@$!%*?&])/
        if (!passA.test(password)) {
            toast.error('Password need one UpperCase Later')
            return
        }
        else if (!passa.test(password)) {
            toast.error('Password need one LowerCase Later')
            return
        }
        else if (!pass6.test(password)) {
            toast.error('Password  need at least 6  character and One Number')
            return
        }
        else if (!special.test(password)) {
            toast.error('Password  need one special latter')
            return
        }
        else if (password !== data.confirmPassword) {
            // toast.error('Password did not match')
            SetError('Password did not match')
            return
        }
        else {
                
               
            createUser(data?.email1, data?.password1).then(Result => {
                // updateData(setUserData({
                //     email:data?.email,
                //     userName:data?.name,
                //     role:data?.role,
                //     NIDorBRITH:data?.NIDorBRITH,
                //     LicenseNumber:data?.LicenseNumber

                // }))
                navigate('/'),
                    toast.success("user login")
            }
                //   Updateprofile(name,image).then(async()=>{

                // //   console.log(info)
                // //  await axiosPublic.post('/user',info).then(()=>{
                // //     toast.success("user login")

                // //   })


                // //   
                // }
                // )
                // .catch(error=>{
                //    toast.error(error.message)
                //     })
            )
                .catch(error => {
                    toast.error(error.message)
                }
                )
        }
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
                                    <div className='relative'>
                                        <input type={`${eye ? 'password' : 'text'}`}  {...register("password")} className="input" placeholder="Password" />
                                        <div onClick={() => setEye(!eye)} className="absolute right-7 top-4">{
                                            eye ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>
                                        }</div>
                                    </div>                                </div>
                                <div>
                                    <label className="label">Re-Type Password</label>

                                    <div className='relative'>
                                        <input type={`${eye ? 'password' : 'text'}`}  {...register("confirmPassword")} className="input" placeholder="Password" />
                                        <div onClick={() => setEye(!eye)} className="absolute right-7 top-4">{
                                            eye ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>
                                        }</div>
                                    </div>
                                    {error && <p className="text-red-500">{error}</p>}
                                </div>

                                <button className="btn btn-neutral mt-4">Registration</button>
                                <LogInWithGoogle />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;