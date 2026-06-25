import React, {useContext } from 'react';
import { AuthContext } from '../Provider/Authprovider.jsx';

const useAuth = () => {
    const info=useContext(AuthContext)
    return info;
};

export default useAuth;