import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import SideNav from './../components/SideNav'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter();
  const [username, setUserName] = useState('')
  const [role, setRole] = useState([])
  
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
        if(userObject.role === false){
          router.push('/users/home')
        } 
      }
      catch(error){
        console.error(`Error prasing user data:${error}`)
      }
    }

  },[router])

  const hotels = async () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    try {
      const userObject = JSON.parse(user)
      const user_id = userObject.user_id
      const res = await fetch(`http://localhost:8000/api/hotels/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch hotels: ${res.status} ${res.statusText}`);
      }
  
      const data = await res.json();
      console.log(data); // Process the data (e.g., set to state)
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };
  

  useEffect(()=>{
    hotels()
  },[])

  return (
    <div className='flex'>
      <div>
        <SideNav></SideNav>
      </div>
      <div>
        <div className='bg-blue-400 h-48 w-full rounded-md'>
          <h1 className='font-extrabold text-2xl'>Hello, { username || 'Admin'}</h1>
          <h2>{hotel.hotel_name}</h2>
          <p></p>
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
