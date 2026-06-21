import React, { createContext,  useEffect, useState } from 'react'
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../Authentication/Firebase/FireBase.jsx';
import { useSelector } from 'react-redux';
import toast from 'daisyui/components/toast/index.js';
import usePublicAxios from '../Hooks/usePublicAxios.jsx';
import { current } from '@reduxjs/toolkit';
import { Users } from 'lucide-react';
export const AuthContext = createContext('')
// export const AuthContex = createContext('')
const provider = new GoogleAuthProvider();





export default function AuthProvider({ children }) {
    const [query,setQuery]=useState('')
    const userdata=useSelector(state=>state.user)
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const axiosPublic = usePublicAxios();
    const signInGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, provider)
    }

    const signIn = (email, pass) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, pass)

    }
   
    const createUser = (email, pass) => {
        setLoading(true)
       
        
        return createUserWithEmailAndPassword(auth, email, pass)

    }
   
    const signOut = () => {


    }
    
   
    

    
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (Currentuser => {
            
            // console.log(Currentuser)
            setLoading(false)
 
            if (Currentuser) {
                const userInfo = {
                    email: Currentuser?.email,
                    userName: Currentuser?.displayName,
                    image: Currentuser?.photoURL,
                    role:userdata?.role ||'volunteer&donar',
                    NIDorBRITH:userdata?.NIDorBRITH,
                    LicenseNumber:userdata?.LicenseNumber

                }
                 
                if(userInfo?.email&&userInfo?.userName&&userInfo?.role){
                  setUser(userInfo)
                  axiosPublic.post('users',userInfo).then(res=>{
                    if(res.data.insertedId){
                               toast.success("user login")
                               
                    }
                   })
                //  axiosPublic.post('/jwt',{ email:CurretUser?.email})
                //  .then(res=>{
                //     if(res.data.token){
                //         localStorage.setItem('token',res.data.token)
                //     }
                //  })

            }
        }
            //  else{
            //     localStorage.removeItem('token')
            //  }
        }))
        return () => unSubscribe()
    }, [axiosPublic,userdata])
    console.log(user)
    const info = {
        signIn,
        signOut,
        createUser,
        signInGoogle,
        setUser,
        loading,
        user,
        setQuery,
        query
    }
    return (
        <div>
            <AuthContext.Provider value={info}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}
