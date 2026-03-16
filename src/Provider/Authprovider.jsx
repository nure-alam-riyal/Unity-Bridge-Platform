import React, { createContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../Authentication/Firebase/FireBase.jsx';
import toast from 'daisyui/components/toast/index.js';
export const AuthContext = createContext('')
// export const AuthContex = createContext('')
   const provider = new GoogleAuthProvider();
export default function AuthProvider({ children }) {
 const [loading, setLoading] = useState(false);
 const [user, setUser] = useState(null);        
     const signInGoogle = () => {
       setLoading(true)
        return signInWithPopup(auth, provider)
    }

    const signIn = (email, pass) => {
      return  signInWithEmailAndPassword(auth, email, pass)
            
    }
    const signUp = (email, pass) => {
       return createUserWithEmailAndPassword(auth, email, pass)
           
    }
    const signOut = () => {


    }
    useEffect(()=>{
       const unSubscribe=onAuthStateChanged(auth,(CurretUser=>{
                     setUser(CurretUser)
                     //console.log(CurretUser)
                     setLoading(false)
                     if(CurretUser){
                        const userInfo={
                            email:CurretUser?.email,
                            userName:CurretUser?.displayName,
                            image:CurretUser?.photoURL,
                          
                        }
                        //console.log(userInfo)
                    //   axiosPublic.post('/user',userInfo).then(res=>{
                    //     if(res.data.insertedId){
                    //                toast.success("user login")
                    //     }
                    //    })
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
       return ()=>unSubscribe()
    },[])
    const info = {
        signIn,
        signOut,
        signUp,
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
