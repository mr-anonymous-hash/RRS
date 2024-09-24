import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import { useRouter } from 'next/router';

const Tables = ({ hotelData }) => {
  const [selectedTable, setSelectedTable] = useState([]);
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [hotelDetail,setHotelDetails ] = useState([])
  const router = useRouter();

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const handleBooking = () => {
    if (numberOfPersons && selectedTable) {
      setBookingDetails({
        table: selectedTable,
        persons: numberOfPersons,
        hotelName: hotelData.hotel_name,
        location: hotelData.location
      });
      setSelectedTable(null);
      setNumberOfPersons('');
      // Here you would typically send this data to your backend
    }
  };

  const hotelDetails = async(id) => {
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
            setHotelDetails(data)
        }
        

    }catch(error){
        console.error(`Error while fetching hotel details:${error}`)
    }
  }
  const renderTables = () => {
    const tables = [];
    for (let i = 1; i <= (hotelDetail.total_tables || 6); i++) {
      tables.push(
        <span
          key={i}
          className='bg-gray-500 w-40 h-40 flex items-center justify-center
           text-white text-2xl font-bold cursor-pointer'
          onClick={() => handleTableClick(i)}
        >
          {i}
        </span>
      );
    }
    return tables;
  };

  useEffect(()=>{
    if(router.query.id) hotelDetails(router.query.id)
  },[router.query.id])

  return (
    <div className='bg-white m-20'>
      <h2 className='text-2xl font-bold mb-4 text-black'>
        {hotelDetail?.hotel_name || 'Table Booking'}</h2>
        {bookingDetails && (
        <div className='mt-4 p-4 border rounded'>
          <h3 className='text-xl mb-2'>Booking Confirmed</h3>
          <p>Table: {bookingDetails.table}</p>
          <p>Persons: {bookingDetails.persons}</p>
          <p>Hotel: {bookingDetails.hotelName}</p>
          <p>Location: {bookingDetails.location}</p>
        </div>
      )}
      <div className='grid grid-cols-2 gap-4 text-center'>
        {renderTables()}
      </div>
      
      {selectedTable && (
        <div className='mt-4 p-4 border rounded'>
          <h3 className='text-xl mb-2 text-black'>Book Table {selectedTable}</h3>
          <input
            type="number"
            value={numberOfPersons}
            onChange={(e) => setNumberOfPersons(e.target.value)}
            placeholder="Number of persons"
            className='border p-2 mr-2'
          />
          <button
            onClick={handleBooking}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Book Now
          </button>
        </div>
      )}

    </div>
  );
};

export default Tables;