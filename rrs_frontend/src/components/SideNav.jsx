import { Router, useRouter } from 'next/router'
import React from 'react'
import './../app/globals.css'

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
        className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200'
      >
        Home
      </a>
      <a 
        onClick={() => router.push('/settings')} 
        className='cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-200'
      >
        Settings
      </a>
      <a 
        onClick={logout} 
        className='cursor-pointer hover:bg-red-500 p-2 rounded transition duration-200'
      >
        Logout
      </a>
    </div>
  </div>
  )
}

export default SideNav
