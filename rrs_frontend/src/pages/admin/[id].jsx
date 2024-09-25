import React, { useEffect, useState } from 'react'
import SideNav from '../../components/SideNav'
import { MdLocationPin } from "react-icons/md";
import { MdOutlineRamenDining } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
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
        <div className='bg-blue-500 h-48 min-w-[900px] mt-12 ml-40 mr-40 rounded-md shadow-gray-300 shadow-lg'>
          <h1 className='font-extrabold text-2xl text-center text-white p-4'>
            {hotel.hotel_name}
          </h1>
          <p className='text-white p-2'>{hotel.hotel_description}</p>
          <p className='text-white p-2 flex items-center capitalize'>
            <MdLocationPin />{hotel.location}
          </p>
        </div>
        <div className='w-full flex justify-center gap-10 mt-16'>
          <button className='border bg-slate-500 w-48 h-28 rounded-md hover:bg-slate-300
          hover:text-slate-500 flex items-center justify-center'>
          <GiWoodenChair className=' text-4xl'/>
          </button>
          <button 
            className='border bg-slate-500 w-48 h-28 rounded-md hover:bg-slate-300 
            hover:text-slate-500 flex items-center justify-center'
            onClick={() => router.push(`/foodItems/${hotel.id}`)}
          >
            <MdOutlineRamenDining className=' text-4xl'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hotel