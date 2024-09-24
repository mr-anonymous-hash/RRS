import { Router, useRouter } from 'next/router'
import React from 'react'
import './../app/globals.css'
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

const SideNav = () => {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }
 
  return (
    <div className='w-40 h-auto min-h-[660px] bg-gray-800 text-white p-4 sticky top-0'>
    <div className='flex flex-col space-y-2'>
      <a 
        onClick={() => router.push('/home')} 
        className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
      >
       <TiHomeOutline className='text-xl'/> Home
      </a>
      <a 
        onClick={() => router.push('/settings')} 
        className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200 flex items-center'
      >
        <IoSettingsOutline className='text-xl'/> Settings
      </a>
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
