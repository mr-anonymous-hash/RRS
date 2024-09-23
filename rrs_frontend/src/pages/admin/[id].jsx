import React, { useEffect, useState } from 'react'
import SideNav from '../../components/SideNav'
import { MdLocationPin } from "react-icons/md";
import { useRouter } from 'next/router'

const Hotel = () => {
  const router = useRouter()
  const [hotel, setHotel] = useState(null)
  const [error, setError] = useState(null)

  const fetchHotel = async (id) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch hotel: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setHotel(data)
    } catch (error) {
      console.error(`Error fetching hotel: ${error}`)
      setError(`Error fetching hotel: ${error.message}`)
    }
  }

  useEffect(() => {
    if (router.isReady && router.query.id) {
      fetchHotel(router.query.id)
    }
  }, [router.isReady, router.query.id])

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>
  }

  if (!hotel) {
    return <div className="text-center mt-10">Loading...</div>
  }

  return (
    <div className='flex'>
      <div>
        <SideNav />
      </div>
      <div>
        <div className='bg-blue-400 h-48 min-w-[900px] mt-12 ml-40 mr-40 rounded-md shadow-gray-300 shadow-lg'>
          <h1 className='font-extrabold text-2xl text-center text-black p-4'>
            {hotel.hotel_name}
          </h1>
          <p className='text-black p-2'>{hotel.hotel_discription}</p>
          <p className='text-black p-2 flex items-center'>
            <MdLocationPin />{hotel.location}
          </p>
        </div>
        <div className='mt-20 ml-20'>
          <button className='border bg-slate-400 w-48 h-28 rounded-md hover:bg-slate-300'>
            Tables
          </button>
          <button 
            className='border bg-slate-400 w-48 h-28 rounded-md hover:bg-slate-300 ml-4'
            onClick={() => router.push(`/foodItems/${hotel.id}`)}
          >
            Food Items
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hotel