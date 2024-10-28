import { Router, useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import { TiHomeOutline } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout, MdOutlineEventAvailable } from "react-icons/md";
import { BiDish } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";

const SideNav = ({Badge}) => {
  const booking = Badge
  const router = useRouter();
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('') 
  const [user, setUser] = useState('')
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  useEffect(()=>{
    if(localStorage.getItem('user')){
      setUser(JSON.parse(localStorage.getItem('user')))
    }
    const userRole = user.role
    const userId  = user.user_id
    setRole(userRole)
    setUserId(userId) 
  },[user])
 
  return (
    <div className='w-full-screem h-auto bg-slate-800 text-white p-4 sticky top-0'>
      <div className='flex justify-between'>
      <h1 className="text-4xl font-bold capitalize flex "> 
        {/* <BiDish/>  */}
        <IoRestaurantOutline className='mr-2'/>
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
            <div class="relative inline-block">
              <p class="inline-block">
                Bookings
              </p>
              {
                booking > 0  ? 
                (
                <span class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-3/4 bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 mb-2 rounded-full">
                  {booking}   
                </span> ) : (<></>)
              }
            </div>
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
      {
        user ? (<a 
          onClick={logout} 
          className='cursor-pointer hover:text-red-500 p-2 rounded transition duration-200 flex items-center gap-1'
        >
           <p>Logout</p>
        </a>) : (
          <a 
          onClick={()=>router.push('/login')} 
          className='cursor-pointer hover:text-red-500 p-2 rounded transition duration-200 flex items-center gap-1'
        >
           <p>Login</p>
        </a>
        )
      }
    </div>
    </div>
  </div>
  )
}

export default SideNav
