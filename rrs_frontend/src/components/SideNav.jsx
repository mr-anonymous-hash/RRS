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
    <div className='w-40 h-auto text-black ' >
        <div><a onClick={()=>router.push('/home')} className='cursor-pointer'>Home</a></div>
        <div><a onClick={()=>router.push('/foodItems')} className='cursor-pointer'>Food Items</a></div>
        <div><a onClick={()=>router.push('/settings')} className='cursor-pointer'>Settings</a></div>
        <div><a onClick={logout} className='cursor-pointer'>Logout</a></div>
    </div>
  )
}

export default SideNav
