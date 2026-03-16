import React, {useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider.jsx';

const useAuth = () => {
    const info=useContext(AuthContext)
    return info;
};

export default useAuth;