import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SideNav from '../../../components/SideNav';
import './../../../app/globals.css';
import { GrClose } from "react-icons/gr";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlineAccessTime } from 'react-icons/md';

const Bookings = () => {
  const router = useRouter();
  const [hotel, setHotel] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
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

  const fetchFoodItems = async(id)=>{
    
    const token = localStorage.getItem('token')

    try{
      const res = await fetch(`http://localhost:8000/api/fooditems/hotel/${id}`,{
        method: 'GET',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch hotel: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setFoodItems(data)
    }
    catch(error){
      console.error(`Error fetching hotel: ${error}`);
      setError(`Error fetching hotel: ${error.message}`);
    }
    
  }

  useEffect(() => {
    if (router.query.id) {
      fetchReservations(router.query.id);
      fetchHotel(router.query.id);
      fetchFoodItems(router.query.id);
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
    <div>
      <SideNav />
    <div className='flex'>
      <div className="flex-1 p-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {hotel && (
          <h1 className="text-2xl font-bold mb-4 capitalize text-slate-800">
            Reservations for {hotel.hotel_name}</h1>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
          {reservations.map((reservation) => (
            <div key={reservation.id} reservation={reservation}>
              <div className='w-auto h-auto bg-slate-300 p-2 rounded-md text-slate-600'  onClick={()=>handleModal(reservation)}>
                <p><strong>Number Of Guests:</strong>  {reservation.no_of_guests}</p>
                <p><strong>Reserved Tables:</strong> {reservation.reserved_tables}</p>
                <p><strong>Table Size :</strong> {reservation.table_size} Seater</p>
                <p><strong>Table No:</strong> {reservation.selected_tables}</p>
                <p className='text-green-600 font-semibold'> Status: {reservation.status == 'pending' ? 'Booked' :  <></>}</p>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
      >

          <div className="bg-gray-50 p-4 rounded-md shadow-md w-full max-w-md mx-auto">
              <div className="mb-4">
                  <p className="text-base text-gray-500">
                      <strong>Booking ID:</strong> {selectedReservation.id}
                  </p>
                  <p className="text-base text-gray-500 capitalize">
                      {/* <strong>Hotel Name:</strong> {selectedHotel.hotel_name} */}
                  </p>
              </div>

              <div className="flex items-center text-gray-500 mb-4">
                  <FaRegCalendarAlt className="mr-2" />
                  <span>{new Date(selectedReservation.reservation_date).
                      toLocaleDateString([], {
                          year: 'numeric', month: 'long', day: 'numeric'
                      })}</span>
                  <MdOutlineAccessTime className="ml-4 mr-2" />
                  <span>{new Date('1970-01-01T' + selectedReservation.reservation_start_time).
                      toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit', hour12: true
                      }) + " - " +
                      new Date('1970-01-01T' + selectedReservation.reservation_end_time).
                          toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit', hour12: true
                          })}</span>
              </div>

              <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2 mt-2 text-slate-600">
                      {selectedReservation.selected_tables.split(',').map((table, index) => (
                          <div key={index} className="p-2 border w-24 h-24 rounded-md 
                      flex flex-col justify-between bg-green-600 text-white">
                              <p className='text-lg font-bold'>#{table.trim()}</p>
                              <p className="text-sm text-end">{selectedReservation.table_size} Seat</p>
                          </div>
                      ))}
                  </div>
              </div>

              <div className='text-slate-500'>
                  {/* <strong>Selected Food:</strong> */}
                  <table className='min-w-full text-center'>
                      <thead className='bg-blue-500 text-white'>
                          <tr>
                              <th className='p-2 '>Food Item</th>
                              <th className='p-2 '>Price (₹)</th>
                          </tr>
                      </thead>
                      <tbody className='border-b'>
                          {
                              foodItems.filter(food => selectedReservation.selected_food.includes(food.id))
                                  .map((food) => (
                                      <tr key={food.id}>
                                          <td className='p-2'>{food.food_name}</td>
                                          <td className='p-2'>₹{food.price}</td>
                                      </tr>
                                  ))
                          }
                      </tbody>
                  </table>

                  <p className='p-2 text-right mr-14'><strong>Total :</strong> ₹{
                      foodItems.filter(food => selectedReservation.selected_food.includes(food.id))
                          .reduce((total, food) => total + food.price, 0)
                  }</p>
              </div>

              {/* <div className="text-right">
                  <button
                      className="bg-blue-500 text-base rounded-md px-4 py-2 text-white font-semibold hover:bg-blue-400"
                      onClick={()=>{
                          setPopup(true)
                          setSelectedId(selectedReservation.id)
                      }}
                  >
                      Cancel booking
                  </button>
              </div> */}
          </div>
      </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Bookings;