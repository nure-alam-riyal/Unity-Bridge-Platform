import { Outlet } from 'react-router-dom'
import NavBar from '../ShareCOmponents/NavBar'


export default function MainLayOut() {
  return (
    <>
    <NavBar></NavBar>
      <Outlet></Outlet>
    </>
   
    
  )
}