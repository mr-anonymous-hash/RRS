import React, { useCallback, useEffect, useState } from 'react'
import SideNav from '../../../components/SideNav'
import './../../../app/globals.css'
import { useRouter } from 'next/router'
import { GrClose } from 'react-icons/gr'
import { FaHotel } from "react-icons/fa6";

const Bookings = () => {

    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [hotels, setHotels] = useState([])
    const [selectedHotel, setSelectedHotel] = useState(null)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const cancelBooking = async(id) => {
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`http://localhost:8000/api/reservations/${id}`,{
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(res.ok){
                setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== id))
              }
        }
        catch(error){
            console.error(`Error while cancel Bookings : ${error}`)
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
            console.error(`Error while fetching Hotels: ${error}`)
        }
    }

    useEffect(()=>{
        if(router.query.id) {
            fetchBookings(router.query.id)
        }
        fetchHotel()
    },[router.query.id])

    const handleModal = useCallback((reservation)=>{
            setSelectedReservation(reservation)
            setIsModalOpen(true)
    },[])

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedReservation(null)
    }

  return (
    <div className='flex flex-cols-2'>
      <div>
        <SideNav/>
      </div>
      <div className='p-8'>
        <h1 className='text-3xl font-bold mb-4 capitalize text-slate-800'>Your Bookings:</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {
            bookings.length === 0 ? ( 
            <div className='bg-gray-200 text-black p-4 rounded-lg shadow-md text-center'>
                <p className='text-lg font-semibold'>No bookings available</p>
            </div> ) : (
                bookings.map((booking) => {
                    const hotel = hotels.find(hotel => hotel.id === booking.hotelId)
                    return (
                        <div key={booking.id}>
                        <div className='w-auto h-auto bg-slate-300 p-2 rounded-md' onClick={()=>{
                            handleModal(booking)
                            setSelectedHotel(hotel)
                            }}>
                            {
                                hotel && <strong  className='text-slate-800 text-xl capitalize flex '><FaHotel className='mr-2'/>{hotel.hotel_name
                                }</strong>
                            }
                        <p className='text-sm text-slate-600'>
                            <strong className='text-slate-600'>
                                Booking Time:
                            </strong>
                            {new Date('1970-01-01T' + booking.reservation_time).toLocaleTimeString([], 
                                { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                        {/* <p className='text-slate-600'>
                            <strong className='text-slate-600'>Table Size:</strong> {booking.table_size} Seater
                        </p>
                        <p className='text-slate-600'>
                            <strong className='text-slate-600'>Table No: </strong>{booking.selected_tables}
                        </p> */}
                        { booking.reserved_tables > 1 ? 
                        (<p className='text-sm text-slate-600'>
                            <strong className='text-slate-600'>Booked Tables:</strong> {booking.reserved_tables }
                        </p>) :
                         (<p className='text-sm text-slate-600'>
                            <strong className='text-slate-600'>Booked Table:</strong> {booking.reserved_tables }
                         </p>) }
                        </div>
                        </div>
                        )
                })
            )}
            
            {   

                isModalOpen && selectedReservation && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center '>
                        <div className='bg-white p-6 rounded-lg max-w-md w-full '>
                        <div className='flex justify-between items-center mb-4 text-slate-800 '>
                            <h2 className='text-2xl font-bold capitalize'>Booking Details of {selectedHotel.hotel_name}</h2>
                            <button 
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                                >
                              <GrClose />
                            </button>
                        </div>
                        <div className='text-slate-600'>
                            <p><strong>No of Guests:</strong>{selectedReservation.no_of_guests}</p>
                            <p><strong>Table Size:</strong>{selectedReservation.table_size} Seater</p>
                            <p><strong>Table No:</strong>{selectedReservation.reserved_tables}</p>
                            <p><strong>Selected Tables:</strong>{selectedReservation.selected_tables}</p>

                            <div className='text-right'>
                                <button className='bg-red-500 rounded-md p-1 text-white font-semibold
                                hover:bg-red-400 ' onClick={()=>{
                                    cancelBooking(selectedReservation.id)
                                    closeModal()
                                    }}>
                                    Cancel Booking
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                )
            }
        </div>
      </div>
    </div>
  )
}

export default Bookings
