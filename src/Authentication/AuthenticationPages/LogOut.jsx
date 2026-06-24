import React from 'react';
import useAuth from '../../Hooks/useAuth';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const LogOut = () => {
    const handleLogOut = () => {
    if (LogOut) {
      LogOut()
        .then(() => {toast("log out successful")
             Navigate('/'); 
        })
        .catch((err) => console.log(err));
    }
  };
    const {LogOut}=useAuth()
    return (
        <div>
 <button 
                    onClick={handleLogOut} 
                    className="py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
                  >
                    Sign Out
                  </button>
            
        </div>
    );
};

export default LogOut;