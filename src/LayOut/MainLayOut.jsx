import { Outlet } from 'react-router-dom'
import NavBar from '../ShareCOmponents/NavBar'
import Footer from '../Pages/Donor/DonorDiscoveryPortal/Footer'


export default function MainLayOut() {
  return (
    <>
    <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
   
    
  )
}