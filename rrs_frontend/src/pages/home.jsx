import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import SideNav from './../components/SideNav'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter();
  const [username, setUserName] = useState('')
  const [hotels, setHotels] = useState([]);
  
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
        if(userObject.role === false){
          router.push('/users/home')
        } 
      }
      catch(error){
        console.error(`Error prasing user data:${error}`)
      }
    }

  },[router])

  const fetchHotels = async () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    try {
      const userObject = JSON.parse(user)
      const user_id = userObject.user_id
      const res = await fetch(`http://localhost:8000/api/hotels/admin/${user_id}`, 
        {
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
      setHotels(data)
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };
  

  useEffect(()=>{
    fetchHotels()
  },[])

  return (
    <div className='flex'>
      <div>
        <SideNav/>
      </div>
      <div>
        <div className='bg-blue-400 h-48 min-w-[900px] mt-12 ml-40  rounded-md shadow-black '>
          <h1 className='font-extrabold text-2xl text-center py-20 '>
            Welcome, { username.toUpperCase() || 'Admin'}</h1>
          <p></p>
        </div>
        <div className='mt-4 ml-24'>
            {
              hotels.map((hotel)=>(
                  <div key={hotel.id} 
                  className='border p-4 rounded-md mb-4 bg-white text-black shadow'>
                      <h2 className='font-bold text-xl'>{hotel.hotel_name}</h2>
                      <p><strong>Location:</strong> {hotel.location}</p>
                      <p><strong>Description:</strong> {hotel.hotel_discription}</p>
                      <p><strong>Category:</strong> {hotel.hotel_category}</p>
                      <p><strong>Cuisines:</strong> {hotel.cuisines}</p>
                      <p><strong>Total Tables:</strong> {hotel.total_tables}</p>
                      <p><strong>Contact:</strong> {hotel.contact_number}</p>
                      <p><strong>Opening Time:</strong> {hotel.opening_time}</p>
                      <p><strong>Closing Time:</strong> {hotel.closing_time}</p>
                  </div>
              ))
            }
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
