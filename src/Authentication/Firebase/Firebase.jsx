// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
//   apiKey:import.meta.env.VITE_apiKey, 
//   authDomain:import.meta.env.VITE_authDomain,
//   projectId:import.meta.env.VITE_projectId,
//   storageBucket:import.meta.env.VITE_storageBucket,
//   messagingSenderId:import.meta.env.VITE_messagingSenderId,
//   appId:import.meta.env.VITE_appId 

 apiKey:import.meta.env.VITE_APIKEY, 
  authDomain:import.meta.env.VITE_AUTHDOMAIN, 
  projectId:import.meta.env.VITE_projectId, 
  storageBucket:import.meta.env.VITE_storageBucket, 
  messagingSenderId:import.meta.env.VITE_messagingSenderId, 
  appId:import.meta.env.VITE_appId, 
// apiKey:"AIzaSyCw6-803DcGXegdQRTzSAo-DF7Ro96rG5c",
// authDomain:"unitybridgeplatform.firebaseapp.com",
// projectId:"unitybridgeplatform",
// storageBucket:"unitybridgeplatform.firebasestorage.app",
// messagingSenderId:"80455951030",
// appId:"1:80455951030:web:6c733c440bced6cdbe7c17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)