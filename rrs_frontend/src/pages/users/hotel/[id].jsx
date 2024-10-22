import React, { useEffect, useState } from 'react'
import './../../../app/globals.css'
import SideNav from '../../../components/SideNav'
import { useRouter } from 'next/router'
import { MdLocationPin, MdTableRestaurant } from 'react-icons/md'
import { FaDoorOpen } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const hotel = () => {

  const router = useRouter()
  const [hotel, setHotel] = useState([])
  const fetchHotel = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (res.ok) {
        const data = await res.json()
        setHotel(data)
      }

    } catch (error) {
      console.error(`Error while Fetching hotel:${error}`)
    }

  }

  useEffect(() => {
    if (router.query.id) {
      fetchHotel(router.query.id)
    }
  }, [router.query.id])

  return (
    <div className='bg-gray-100 h-screen'>
      <div>
        <SideNav />
      </div>
      <div>
        <div className='h-96'>
          <div>
          <h1 className='font-extrabold text-3xl text-center capitalize text-slate-800 p-4'>
              {hotel.hotel_name}
            </h1>
          </div>
          <div className=' h-40 min-w-[1000px]  ml-40 mr-40 rounded-md shadow-gray-300 shadow-lg'
          
            >
            
            <div className='text-base p-4'>
              <p className='text-slate-500 p-2'>{hotel.hotel_description}</p>
              <div className=' flex justify-between items-center '>
                <p className='text-slate-500 p-2 flex items-center capitalize'>
                  <MdLocationPin />{hotel.location}
                </p>
                <div className='px-4 flex justify-between items-center'>
                  <div className='flex gap-2 items-center text-slate-500'>
                    <MdAccessTime />
                    <p >{new Date(`1970-01-01T${hotel.opening_time}`).toLocaleTimeString([],
                      { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(`1970-01-01T${hotel.closing_time}`).toLocaleTimeString([],
                        { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-10"
        >
          <span
            className="text-white text-xl  w-48 h-28 rounded-md flex flex-col items-center
           justify-center cursor-pointer"
            onClick={() => router.push(`/users/table/${hotel.id}`)}
            style={{backgroundImage:'url(http://localhost:8000/image/coffee-shop-7369404_1920.jpg)'}}
          >
            <MdTableRestaurant className="text-4xl" />
            <label className="">Book Table</label>
          </span>
          <div>
            
          </div>
        </div>

      </div>
    </div>
  )
}

export default hotel
