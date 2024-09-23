import React, { use, useEffect, useState } from 'react'
import './../app/globals.css'
import SideNav from './../components/SideNav'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter();
  const [username, setUserName] = useState('')
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true)
  
  useEffect(()=>{
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if(!token){
      router.push('/login')
    }
    if(user){
      try{
        setLoading(true)
        const userObject = JSON.parse(user)
        setUserName(userObject.name)
        if(userObject.role === false){
          router.push('/users/home')
        } 
      }
      catch(error){
        console.error(`Error prasing user data:${error}`)
      }
      finally{
        setLoading(false)
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
        <div className='bg-blue-400 h-48 min-w-[900px] mt-12 ml-40 mr-40  rounded-md shadow-gray-300 shadow-lg '>
          <h1 className='font-extrabold text-2xl text-center py-20 '>
            Welcome, { username.toUpperCase() || 'Admin'}</h1>
          <p></p>
        </div>
        <div className='mt-14 ml-24 mr-24'>
            {
              loading ? (
                <div class="flex items-center justify-center min-h-screen">
                  <div class="flex items-center space-x-2">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <div class="text-lg font-semibold">Loading...</div>
                  </div>
                </div>                
              ) : hotels.length === 0 ? (
                <div className='text-center p-8 bg-white rounded-md shadow'>
                  <p className='text-xl mb-4 text-slate-400'>You need to add a hotel to get started.</p>
                  <button 
                    onClick={()=>router.push('/add_hotel')}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
                  >
                    Add Hotel
                  </button>
                </div>
              ) : (
                hotels.map((hotel)=>(
                  <div key={hotel.id} onClick={()=>router.push(`/admin/${hotel.id}`)} 
                  className='border p-4 rounded-md mb-4 bg-white text-black cursor-pointer shadow hover:bg-slate-100'>
                      <h2 className='font-bold text-xl'>{hotel.hotel_name}</h2>
                      <p><strong>Location:</strong> {hotel.location}</p>
                      <p><strong>Description:</strong> {hotel.hotel_discription}</p>
                  </div>
            )))
            }
            
        </div>
      </div>
    </div>
  )
}

export default Home
