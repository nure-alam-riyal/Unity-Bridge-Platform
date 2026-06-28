import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth";
import usePublicAxios from "../Hooks/usePublicAxios";



const AgentRoute = ({ children }) => {
  const location = useLocation();
  console.log(location.pathname)
  const navigate=useNavigate()
  const { user,loading} = useAuth();
  const from = location.state?.from?.pathname
  if(from)
    navigate(location.pathname)
    
  
  const axios = usePublicAxios();
console.log(user)
  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("users");
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading ||loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const oneuser = data.find((u) => u.email === user?.email);

  if (oneuser?.status === "verified" && oneuser?.role === "NGO") {
    return children;
  }

  if (oneuser?.role === "NGO") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold text-warning">
          Account Under Review
        </h2>
        <p className="text-gray-500">
          Please wait for admin verification.
        </p>
        <span className="loading loading-dots loading-md"></span>
      </div>
    );
  }

  if (oneuser?.status === "verified") {
    return children;
  }

  return (
    <Navigate
      to="/login"
      state={{ from: location.pathname }}
      replace
    />
  );
};

export default AgentRoute;