import React, { useEffect, useState } from 'react'
import './../../app/globals.css'
import SideNav from '../../components/SideNav'

const home = () => {
  const [username, setUserName] = useState('')

  useEffect(()=>{
    const user = localStorage.getItem('user')
    try{
      const userObject = JSON.parse(user)
      if(user){
        setUserName(userObject.name)
      }
    }
    catch(error){
      console.error(`Error user name not found: ${error}`)
    }
  })
  return (

    <div className='flex '>
      <div>
        <SideNav></SideNav>
      </div>
    <div className='flex flex-col gap-5 text-center w-[1200px] '>
      <div className='text-black text-center bg-sky-500 h-20 rounded-lg'>
        <h1 className='font-extrabold text-2xl'>Welcome, {username}</h1>
      </div>
      <div className=''>
        <div>
        <input type='search' placeholder='search...' className='border border-gray-500 h-10 w-60 rounded-md'/>
        </div>
        <div className='grid grid-cols-2 gap-8 mt-10 place-content-center'>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default home
