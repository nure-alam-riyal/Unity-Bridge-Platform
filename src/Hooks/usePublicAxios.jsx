import axios from 'axios';
const publicAxios = axios.create({
  baseURL:" https://unity-bridge-platform-backend.vercel.app"
  // baseURL:"http://localhost:5050",
});
const usePublicAxios = () => {
    return publicAxios;
};

export default usePublicAxios;