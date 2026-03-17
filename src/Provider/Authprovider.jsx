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
export const AuthContext = createContext('')
// export const AuthContex = createContext('')
const provider = new GoogleAuthProvider();





export default function AuthProvider({ children }) {
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
        console.log(email, pass)
        console.log(auth)
        return createUserWithEmailAndPassword(auth, email, pass)

    }
    const signOut = () => {


    }
    console.log(userdata)
    
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (CurretUser => {
            setUser(CurretUser)
            // console.log(CurretUser)
            setLoading(false)
            if (CurretUser) {
                const userInfo = {
                    email: CurretUser?.email,
                    userName: CurretUser?.displayName,
                    image: CurretUser?.photoURL,
                    role:userdata?.role,
                    NIDorBRITH:userdata?.NIDorBRITH,
                    LicenseNumber:userdata?.LicenseNumber

                }
                console.log(userInfo)
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
            //  else{
            //     localStorage.removeItem('token')
            //  }
        }))
        return () => unSubscribe()
    }, [axiosPublic])
    const info = {
        signIn,
        signOut,
        createUser,
        signInGoogle,
        setUser,
        loading,
        user
    }
    return (
        <div>
            <AuthContext.Provider value={info}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}
