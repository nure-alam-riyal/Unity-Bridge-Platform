import React, { createContext } from 'react'
export const AuthContext=createContext('')
export default function AuthProvider({children}) {
    const info={}
  return (
   <div>
    <AuthContext.Provider value={info}>
        {children}
    </AuthContext.Provider>
   </div>
  )
}
