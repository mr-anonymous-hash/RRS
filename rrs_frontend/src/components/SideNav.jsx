import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout, MdOutlineEventAvailable } from "react-icons/md";
import { BiDish } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";

const SideNav = () => {
  const router = useRouter();
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('') 
  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    const userRole = user.role
    const userId  = user.user_id
    setRole(userRole)
    setUserId(userId) 
  })
 
  return (
    <div className='w-full-screem h-auto bg-slate-800 text-white p-4 sticky top-0'>
      <div className='flex justify-between'>
      <h1 className="text-4xl font-bold capitalize flex "> 
        {/* <BiDish/>  */}
        <IoRestaurantOutline/>
        TableTime</h1>
      
    <div className='flex justify-end'>
      <a 
        onClick={() => router.push('/home')} 
        className='cursor-pointer  p-2 rounded transition duration-200 flex items-center gap-1'
      >
       {/* <TiHomeOutline className='text-xl'/>  */}
       <p>Home</p>
      </a>
      {
        role !== true && (
          <a 
            onClick={()=> router.push(`/users/bookings/${userId}`)}
            className='cursor-pointer  p-2 rounded transition duration-200 flex items-center gap-1'
          >
            {/* <MdOutlineEventAvailable className='text-xl'/>  */}
            <p>Bookings</p>
          </a>
        )
      }
      {
        role !== true ? (<a 
          onClick={()=> router.push(`/users/settings/${userId}`)} 
          className='cursor-pointer  p-2 rounded transition duration-200 flex items-center gap-1'
        >
          {/* <FaRegUserCircle className='text-xl'/>  */}
          <p>Settings</p>
        </a>) : (
          <a 
          onClick={()=>router.push('/settings')} 
          className='cursor-pointer  p-2 rounded transition duration-200 flex items-center gap-1'
        >
          {/* <IoSettingsOutline className='text-xl'/>  */}
          <p>Settings</p>
        </a>
        )
      }
      <a 
        onClick={logout} 
        className='cursor-pointer hover:text-red-500 p-2 rounded transition duration-200 flex items-center gap-1'
      >
        {/* <MdLogout className='text-xl'/> */}
         <p>Logout</p>
      </a>
    </div>
    </div>
  </div>
  )
}

export default SideNav
