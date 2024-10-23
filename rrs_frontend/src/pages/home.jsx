import React, { useEffect, useState } from 'react'
import './../app/globals.css'
import SideNav from './../components/SideNav'
import { useRouter } from 'next/router'
import { MdLocationPin } from 'react-icons/md'

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-lg font-semibold text-slate-800">Loading...</div>
      </div>
    </div>
  );

  return (
    <div>
      <SideNav/>
      <div className='flex items-center justify-center'>
      <div>
        <div className='bg-white h-48 min-w-[900px] mt-12  rounded-md'>
          <h1 className='font-extrabold text-3xl text-center pt-10 text-slate-800 '>
            Welcome, { username.toUpperCase() || 'Admin'}
          </h1>
          <div>
          <p className='text-slate-800 p-4'>We're glad to see you here! Let's manage your restaurant efficiently and provide a delightful dining experience to your guests.</p>
          </div>
        </div>

        {/* Admin Dashboard Section */}
        {/* <div className='mt-8 ml-40 mr-40'>
          <div className='bg-gray-100 p-8 rounded-md shadow-lg'>
            <h2 className='font-bold text-xl mb-4 text-center'>Admin Dashboard</h2>
            <div className='grid grid-cols-2 gap-8'>
              <div className='p-4 bg-white rounded shadow hover:bg-blue-100 cursor-pointer'>
                <h3 className='font-bold'>Manage Reservations</h3>
                <p>View and manage customer reservations.</p>
              </div>
              <div className='p-4 bg-white rounded shadow hover:bg-blue-100 cursor-pointer'>
                <h3 className='font-bold'>Update Menu</h3>
                <p>Update and customize the available food items.</p>
              </div>
              <div className='p-4 bg-white rounded shadow hover:bg-blue-100 cursor-pointer'>
                <h3 className='font-bold'>Hotel Settings</h3>
                <p>Modify hotel details, contact information, and settings.</p>
              </div>
              <div className='p-4 bg-white rounded shadow hover:bg-blue-100 cursor-pointer'>
                <h3 className='font-bold'>View Reports</h3>
                <p>Access sales, reservations, and performance reports.</p>
              </div>
            </div>
          </div>
        </div> */}

        <div className='mt-14 ml-24 mr-24'>
          {hotels.length === 0 ? (
            <div className='text-center p-8 bg-white rounded-md shadow'>
              <p className='text-xl mb-4 text-slate-400'>
                You need to add a hotel to get started.
              </p>
              <button 
                onClick={() => router.push('/add_hotel')}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
              >
                Add Hotel
              </button>
            </div>
          ) : (
            hotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => router.push(`/admin/${hotel.id}`)} 
                className='border p-4 rounded-md mb-4 hover:bg-slate-500 hover:text-white cursor-pointer shadow bg-slate-300 text-slate-500 capitalize'>
                <h2 className='font-bold text-xl'>{hotel.hotel_name}</h2>
                <p className='flex items-center capitalize'>
                  <MdLocationPin className='text-lg' /> {hotel.location}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home
