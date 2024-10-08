import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SideNav from '../../../components/SideNav';
import './../../../app/globals.css';


const Bookings = () => {
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchReservations = async (hotelId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/reservations/hotel/${hotelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      } else {
        console.error(`Data not found`);
        setError('Failed to fetch reservations');
      }
    } catch (error) {
      console.error(`Error while fetching reservations: ${error}`);
      setError('Error while fetching reservations');
    }
  };

  const fetchHotel = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch hotel: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setHotel(data);
    } catch (error) {
      console.error(`Error fetching hotel: ${error}`);
      setError(`Error fetching hotel: ${error.message}`);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      fetchReservations(router.query.id);
      fetchHotel(router.query.id);
    }
  }, [router.query.id]);

  const handleModal = (reservation)=>{
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReservation(null)
  }

  return (
    <div className='flex'>
      <SideNav />
      <div className="flex-1 p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {hotel && (
          <h1 className="text-2xl font-bold mb-4 capitalize text-slate-800">
            Reservations for {hotel.hotel_name}</h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          {reservations.map((reservation) => (
            <div key={reservation.id} reservation={reservation}>
              <div className='w-auto h-auto bg-slate-300 p-2 rounded-md'  onClick={()=>handleModal(reservation)}>
                <p> Number Of Guests: {reservation.no_of_guests}</p>
                <p> Reserved Tables: {reservation.reserved_tables}</p>
                <p> Table Size : {reservation.table_size} Seater</p>
                <p> Table No: {reservation.selected_tables}</p>
                <p className='text-green-600 font-semibold'> Status: {reservation.status == 'pending' ? 'Booked' :  <></>}</p>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4 text-slate-800">
                <h2 className="text-xl font-bold">Reservation Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="text-slate-500">
                <p><strong>Number of Guests:</strong> {selectedReservation.no_of_guests}</p>
                <p><strong>Table Size:</strong> {selectedReservation.table_size} Seater</p>
                <p><strong>Selected Tables:</strong> {selectedReservation.selected_tables}</p>
                <p><strong>Reserved Tables:</strong> {selectedReservation.reserved_tables}</p>
                <p><strong>Selected Food:</strong> {selectedReservation.selected_food}</p>
                <p><strong>Reservation Time:</strong> {selectedReservation.reservation_time}</p>
                <p><strong>Status:</strong> {selectedReservation.status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;