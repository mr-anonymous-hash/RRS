import React, { useEffect, useState } from 'react'
import './../../app/globals.css'
import SideNav from '../../components/SideNav'
import { useRouter } from 'next/router';
import { MdLocationPin } from 'react-icons/md';

const home = () => {
  const [username, setUserName] = useState('')
  const [hotels, setHotels] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchHotels = async() => {
    try{
      const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8000/api/hotels',
      {
        method: 'GET',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
        },
      })
      if(res.ok){
        const data = await res.json()
        const shuffled = data.sort(()=> 0.5 - Math.random())
        setHotels(shuffled.slice(0,6))
      }
      else{
        throw new Error('Failed to fetch hotels')
      }
    }
    catch(error){
      console.log(`Error while Fetching Hotels:${error}`)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    const user = localStorage.getItem('user')
    try{
      const userObject = JSON.parse(user)
      if(user){
        setUserName(userObject.name)
        setTimeout(()=>{
          fetchHotels()
        },1000)
      }
    }
    catch(error){
      console.error(`Error user name not found: ${error}`)
    }
  },[])

  const filterHotels = hotels.filter(
    hotel => hotel.hotel_name.toLowerCase().includes(search.toLowerCase()) ||
  hotel.location.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <div className="flex min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <SideNav/>
      </div>
      <div className="flex-1 p-10">
        <header className="bg-blue-500 text-white p-6 rounded-lg shadow-md mb-8 flex justify-center">
          <h1 className="text-3xl font-bold capitalize">Welcome, {username}</h1>
        </header>
        <div className="mb-6">
          <input
            type="search"
            placeholder=" Search hotels..."
            className="w-full p-3 rounded-md border border-gray-300 
            text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <div className="text-lg font-semibold">Loading...</div>
          </div>
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterHotels.map((hotel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden
               hover:shadow-lg transition-shadow duration-300 text-black"
               onClick={()=>router.push(`/users/hotel/${hotel.id}`)}>
                <img src={`http://localhost:8000/${hotel.image_path}`} 
                alt={hotel.hotel_name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 capitalize">{hotel.hotel_name}</h2>
                  <p className="text-gray-600 flex items-center capitalize">
                    <MdLocationPin/>{hotel.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default home
