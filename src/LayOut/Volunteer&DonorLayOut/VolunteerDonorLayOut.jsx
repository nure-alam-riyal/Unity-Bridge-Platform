import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNavigation from './SideNavigation'

export default function VolunteerDonorLayOut() {
  return (
    <div>
        <div className='grid gap-4 grid-cols-12'>
            <div className='col-span-2'><SideNavigation></SideNavigation></div>
            <div className='col-span-10 '>
              <div className='flex justify-center items-center'>
                <Outlet></Outlet>
              </div>
            </div>
        </div>
    </div>
  )
}
