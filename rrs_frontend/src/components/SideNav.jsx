import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout, MdOutlineEventAvailable } from "react-icons/md";

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
    <div className='w-40 h-auto min-h-[660px] bg-gray-800 text-white p-4 sticky top-0'>
    <div className='flex flex-col space-y-2'>
      <a 
        onClick={() => router.push('/home')} 
        className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
      >
       <TiHomeOutline className='text-xl'/> Home
      </a>
      {
        role !== true && (
          <a 
            onClick={()=> router.push(`/users/bookings/${userId}`)}
            className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
          >
            <MdOutlineEventAvailable className='text-xl'/>Bookings
          </a>
        )
      }
      {
        role !== true ? (<a 
          onClick={()=> router.push(`/users/settings/${userId}`)} 
          className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
        >
          <FaRegUserCircle className='text-xl'/>Settings
        </a>) : (
          <a 
          onClick={()=>router.push('/settings')} 
          className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
        >
          <IoSettingsOutline className='text-xl'/>Settings
        </a>
        )
      }
      <a 
        onClick={logout} 
        className='cursor-pointer hover:bg-red-500 p-2 rounded transition duration-200 flex items-center'
      >
        <MdLogout className='text-xl'/>Logout
      </a>
    </div>
  </div>
  )
}

export default SideNav
