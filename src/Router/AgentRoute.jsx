
import { Navigate, useLocation } from "react-router-dom";

// import PropTypes from 'prop-types'
import useQuerys from "../Hooks/useQuerys.jsx";
const AgentRoute = ({children}) => {
    const location=useLocation()
   
    const oneuser=useQuerys({users:"users"})
   if(oneuser[0]?.role=='NGO')
        return children

    else
   return <Navigate to={'/login'} state={location?.pathname}></Navigate>
};
// AgentRoute.propTypes={
//     children:PropTypes.node
// }

export default AgentRoute;