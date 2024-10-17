import React, { useCallback, useEffect, useState } from 'react'
import SideNav from '../../../components/SideNav'
import './../../../app/globals.css'
import { useRouter } from 'next/router'
import { GrClose } from 'react-icons/gr'
import { FaHotel } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";

const Bookings = () => {

    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [hotels, setHotels] = useState([])
    const [selectedHotel, setSelectedHotel] = useState(null)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchBookings = async (id) => {
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:8000/api/reservations/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                const data = await res.json()
                setBookings(data)
            }
        }
        catch (error) {
            console.error(`Error while fetching Bookings : ${error}`)
        }
    }

    const cancelBooking = async (id) => {
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:8000/api/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                setBookings((prevBookings) => prevBookings.filter(booking => booking.id !== id))
            }
        }
        catch (error) {
            console.error(`Error while cancel Bookings : ${error}`)
        }
    }
    const fetchHotel = async () => {
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:8000/api/hotels`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                const data = await res.json()
                setHotels(data)
            }
        }
        catch (error) {
            console.error(`Error while fetching Hotels: ${error}`)
        }
    }

    useEffect(() => {
        if (router.query.id) {
            fetchBookings(router.query.id)
        }
        fetchHotel()
    }, [router.query.id])

    const handleModal = useCallback((reservation) => {
        setSelectedReservation(reservation)
        setIsModalOpen(true)
    }, [])

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedReservation(null)
    }

    return (
        <div className='flex flex-cols-2'>
            <div>
                <SideNav />
            </div>
            <div className='p-8'>
                <h1 className='text-3xl font-bold mb-4 capitalize text-slate-800'>Your Bookings:</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        bookings.length === 0 ? (
                            <div className='bg-gray-200 text-black p-4 rounded-lg shadow-md text-center'>
                                <p className='text-lg font-semibold'>No bookings available</p>
                            </div>) : (
                            bookings.map((booking) => {
                                const hotel = hotels.find(hotel => hotel.id === booking.hotelId)
                                return (
                                    <div key={booking.id}>
                                        <div className='w-auto h-auto bg-slate-300 p-2 rounded-md' onClick={() => {
                                            handleModal(booking)
                                            setSelectedHotel(hotel)
                                        }}>
                                            {
                                                hotel && <strong className='text-slate-800 text-xl capitalize flex items-center '><FaHotel className='mr-2' />{hotel.hotel_name
                                                }</strong>
                                            }
                                            <p className='text-base text-slate-600 flex items-center'>
                                                <strong><FaRegCalendarAlt /></strong>
                                                {new Date(booking.reservation_date).toLocaleDateString([], {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                            <p className='text-base text-slate-600 flex items-center'>
                                                <strong className='text-slate-600'>
                                                    <MdOutlineAccessTime />
                                                </strong>
                                                {new Date('1970-01-01T' + booking.reservation_start_time).toLocaleTimeString([],
                                                    { hour: '2-digit', minute: '2-digit', hour12: true }) + " - " +
                                                    new Date('1970-01-01T' + booking.reservation_end_time).toLocaleTimeString([],
                                                        { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}

                    {

isModalOpen && selectedReservation && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-50 p-4 rounded-md shadow-md w-full max-w-md mx-auto">
            <div className="mb-4">
                <p className="text-base text-gray-500">
                    <strong>Booking ID:</strong> {selectedReservation.id}
                </p>
                <p className="text-base text-gray-500 capitalize">
                    <strong>Hotel Name:</strong> {selectedHotel.hotel_name}
                </p>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
                <FaRegCalendarAlt className="mr-2" />
                <span>{new Date(selectedReservation.reservation_date).
                    toLocaleDateString([], {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                <MdOutlineAccessTime className="ml-4 mr-2" />
                <span>{new Date('1970-01-01T' + selectedReservation.reservation_start_time).
                    toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit', hour12: true
                    }) + " " +
                    new Date('1970-01-01T' + selectedReservation.reservation_end_time).
                    toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit', hour12: true
                    })}</span>
            </div>

            {/* Dynamic divs based on selected_tables */}
            <div className="mb-4">
                {/* <strong>Selected Tables:</strong> */}
                <div className="grid grid-cols-4 gap-2 mt-2 text-slate-600">
                    {selectedReservation.selected_tables.split(',').map((table, index) => (
                        <div key={index} className="p-2 border w-24 h-24 rounded-md 
                         flex flex-col justify-between bg-gray-400 text-white hover:bg-gray-200 hover:text-slate-600">
                            <p className='text-lg font-bold'>#{table.trim()}</p>
                            <p className="text-sm text-end">{selectedReservation.table_size} Seat</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mb-4">
                {/* <p className="text-lg font-bold text-slate-600">#{selectedReservation.selected_tables}</p> */}
                
            </div>

            <div className="text-right">
                <button
                    className="bg-blue-500 text-base md:text-lg rounded-md px-4 py-2 text-white font-semibold hover:bg-blue-400"
                    onClick={cancelBooking}
                >
                    Cancel booking
                </button>
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
