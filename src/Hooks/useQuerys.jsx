import React from 'react';
import useAuth from './useAuth';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from './usePublicAxios';
import Loading from '../components/Loading';
import { useActionData } from 'react-router-dom';

const useQuerys = (p) => {
    const {user}=useAuth()
    const axios=usePublicAxios()
     const {users}=p
console.log(users)
           const { data, isLoading, isError } = useQuery(
            {
              queryKey: ['data',users,p],
              queryFn: async() => await axios.get(users).then(res => res.data)
            })
          
        
          if (isLoading) {
            return <Loading></Loading>
          }
          
    const oneuser = data?.filter((u) =>{
      if(u.email===user?.email)
        return {u}
    else data
    } );
    console.log(oneuser,data)
    return oneuser
}

export default useQuerys;