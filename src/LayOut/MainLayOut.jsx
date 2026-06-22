import { Outlet } from 'react-router-dom';
import NavBar from '../ShareCOmponents/NavBar';
import Footer from '../Pages/Donor/DonorDiscoveryPortal/Footer';

export default function MainLayOut() {
  return (
    <div className="flex flex-col min-h-screen">
      
     
      <NavBar />

     
      <main className="flex-grow pt-16 pb-16 overflow-y-auto">
        <Outlet />
      </main>

    
      <div className=" w-full z-50">
        <Footer />
      </div>

    </div>
  );
}