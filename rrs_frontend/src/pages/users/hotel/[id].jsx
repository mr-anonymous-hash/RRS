import React, { useEffect, useState } from 'react'
import './../../../app/globals.css'
import SideNav from '../../../components/SideNav'
import { useRouter } from 'next/router'
import { MdLocationPin } from 'react-icons/md'
const hotel = () => {

  const router = useRouter()
  const [hotel, setHotel] = useState([])
  const fetchHotel = async(id) => {
    try{
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`,
        {
          method: 'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if(res.ok){
      const data = await res.json()
      setHotel(data)
    }

    }catch(error){
      console.error(`Error while Fetching hotel:${error}`)
    }  

  }

  useEffect(()=>{
    if(router.query.id){
      fetchHotel(router.query.id)
    }
  },[router.query.id])

  return (
    <div className='flex flex-cols-2'>
      <div>
      <SideNav/>
      </div>
      <div>
        <div className=''>
        <div className='bg-blue-500 h-48 min-w-[900px] mt-12 ml-40 mr-40 rounded-md shadow-gray-300 shadow-lg'>
          <h1 className='font-extrabold text-2xl text-center text-white p-4'>
            {hotel.hotel_name}
          </h1>
          <p className='text-white p-2'>{hotel.hotel_discription}</p>
          <p className='text-white p-2 flex items-center'>
            <MdLocationPin />{hotel.location}
          </p>
          <div className='px-4 flex justify-between'>
            <p>opening:{hotel.opening_time}</p>
            <p>closing:{hotel.closing_time}</p>
          </div>
        </div>
        <button className='text-black ml-60 mt-32 bg-slate-400 rounded-md'
        onClick={()=>router.push(`/users/table/${hotel.id}`)}>Select Table</button>
        </div>
      </div>
    </div>
  )
}

export default hotel
