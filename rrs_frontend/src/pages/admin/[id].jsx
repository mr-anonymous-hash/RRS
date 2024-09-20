import React, { useEffect, useState } from 'react'
import SideNav from '../../components/SideNav'
import { MdLocationPin } from "react-icons/md";
import { useRouter } from 'next/router'

const hotel = () => {
  
  const router = useRouter()
  const {id} = router.query
  const [hotel, setHotel] = useState([])

  const fetchHotel = async()=>{
    const token = localStorage.getItem('token')
    try{
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`,
        {
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch hotels: ${res.status} ${res.statusText}`);
        }
    
        const data = await res.json(); 
        setHotel(data)
    }
    catch(error){
      console.error(`Error fetching hotel:${error}`)
    }
  }

  useEffect(()=>{
    if(id) fetchHotel()
  },[id])

  return (
    <div className='flex'>
      <div>
        <SideNav/>
      </div>
        <div>
          <div className='bg-blue-400 h-48 min-w-[900px] mt-12 ml-40 mr-40  rounded-md
          shadow-gray-300 shadow-lg '>
            <h1 className='font-extrabold text-2xl text-center text-black p-4'>
            {hotel.hotel_name}</h1>
            <p className='text-black p-2'>{hotel.hotel_discription}</p>
            <p className='text-black p-2 flex items-center'>
              <MdLocationPin/>{hotel.location}.
            </p>
          </div>
          <div className='mt-20 ml-20'>
            <button className='border  bg-slate-400 w-48 h-28 rounded-md'>Tables</button>
            <button className='border  bg-slate-400 w-48 h-28 rounded-md'
            onClick={()=>router.push('/foodItems')}>
              Food Items</button>
          </div>
        </div>
    </div>
  )
}

export default hotel
