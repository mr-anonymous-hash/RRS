import React, { useEffect, useState } from 'react'
import SideNav from '../../../components/SideNav'
import './../../../app/globals.css'
import { useRouter } from 'next/router'

const Bookings = () => {

    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [hotels, setHotels] = useState([])

    const fetchBookings = async(id) => {
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`http://localhost:8000/api/reservations/users/${id}`,{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(res.ok){
                const data = await res.json()
                setBookings(data)
              }
        }
        catch(error){
            console.error(`Error while fetching Bookings : ${error}`)
        }
    }

    const fetchHotel = async() => {
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`http://localhost:8000/api/hotels`,{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(res.ok){
                const data = await res.json()
                setHotels(data)
              }
        }
        catch(error){
            console.error(`Error while fetching Bookings : ${error}`)
        }
    }

    useEffect(()=>{
        if(router.query.id) {
            fetchBookings(router.query.id)
        }
        fetchHotel()
    },[router.query.id])

  return (
    <div className='flex flex-cols-2'>
      <div>
        <SideNav/>
      </div>
      <div className='p-8'>
        <h1 className='text-2xl font-bold mb-4 capitalize text-slate-800'>Your Bookings:</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            { bookings.map((booking) => {
                const hotel = hotels.find(hotel => hotel.id === booking.hotelId)
                return (
                    <div key={booking.id}>
                    <div className='w-auto h-auto bg-slate-300 p-2 rounded-md'>
                        {
                            hotel && <strong  className='text-black text-lg capitalize'>{hotel.hotel_name}</strong>
                        }
                    <p className='text-black'>Booking Time: {new Date('1970-01-01T' + booking.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    <p className='text-black'>Table Size: {booking.table_size} Seater</p>
                    <p className='text-black'>Booked Table: {booking.selected_tables}</p>
                    <p className='text-black'>Table No: {booking.reserved_tables}</p>
                    </div>
                    </div>
                    )
            })}
        </div>
      </div>
    </div>
  )
}

export default Bookings
