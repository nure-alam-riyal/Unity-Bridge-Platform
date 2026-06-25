
import useAuth from "../Hooks/useAuth.jsx";


import { Navigate, useLocation } from "react-router-dom";
import useQuerys from '../Hooks/useQuerys.jsx'
// import PropTypes from 'prop-types'
const AdminRoute = ({children}) => {
    const location=useLocation()
    // console.log(location)

    const oneuser=useQuerys({users:"users"})
   
    if(oneuser[0]?.role==='admin')
        return children

    else
   return <Navigate to={'/login'} state={location?.pathname}></Navigate>
};
// AdminRoute.PropTypes={
//     children:PropTypes.node
// }

export default AdminRoute;