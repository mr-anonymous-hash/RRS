import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import SideNav from './../components/SideNav'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter();
  const [username, setUserName] = useState('')
  const [role, setRole] = useState('')

  useEffect(()=>{
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
  
    if(!token){
      router.push('/login')
    }
    if(user){
      try{
        const userObject = JSON.parse(user)
        setUserName(userObject.name)
        setRole(userObject.role)
        if(!role == 'true'){
          router.push('/users/home')
        }
      }
      catch(error){
        console.error(`Error prasing user data:${error}`)
      }
    }

  },[router])

  return (
    <div className='flex'>
      <div>
        <SideNav></SideNav>
      </div>
      <div>
        <div className='bg-blue-400 h-48 w-full rounded-md'>
          <h1 className='font-extrabold text-2xl'>Hello, { username || 'Admin'}</h1>
          <p>Hotel Annaporanas, Singanallore</p>
        </div>
        <div>
          <button className='border  bg-slate-400 w-48 h-28 rounded-md'>Tables</button>
          <button className='border  bg-slate-400 w-48 h-28 rounded-md'>Food Items</button>
        </div>
      </div>
    </div>
  )
}

export default Home
