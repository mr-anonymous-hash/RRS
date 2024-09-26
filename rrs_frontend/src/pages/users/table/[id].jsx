import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import { useRouter } from 'next/router';
import { MdOutlineArrowBack } from 'react-icons/md';

const Tables = () => {
  const [hotelDetail, setHotelDetail] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    reservationTime: '',
    tableSize: '',
    guestCount: '',
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const router = useRouter();

  const fetchHotelDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHotelDetail(data);
      }
    } catch (error) {
      console.error(`Error while fetching hotel details: ${error}`);
    }
  };

  useEffect(() => {
    if (router.query.id) fetchHotelDetails(router.query.id);
  }, [router.query.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo({ ...bookingInfo, [name]: value });
    
    if (name === 'tableSize') {
      updateAvailableTables(parseInt(value));
    }
  };

  const updateAvailableTables = (selectedSeats) => {
    if (hotelDetail && hotelDetail.table_config) {
      const config = hotelDetail.table_config.find(c => c.seats === selectedSeats);
      if (config) {
        setAvailableTables(Array.from({ length: config.count }, (_, i) => i + 1));
      } else {
        setAvailableTables([]);
      }
    }
  };

  const handleTableSelection = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const handleBooking = () => {
    if (selectedTable && bookingInfo.tableSize && bookingInfo.reservationTime && bookingInfo.guestCount) {
      setBookingConfirmed(true);
    }
  };

  const renderBookingForm = () => (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-xl mb-2 text-black">Booking Information</h3>
      <div className='text-black'>
      <input
        type="datetime-local"
        name="reservationTime"
        value={bookingInfo.reservationTime}
        onChange={handleInputChange}
        className="border p-2 mr-2 mb-2 w-full"
      />
      <select
        name="tableSize"
        value={bookingInfo.tableSize}
        onChange={handleInputChange}
        className="border p-2 mr-2 mb-2 w-full"
      >
        <option value="" className='text-gray-900'>Select table size</option>
        {hotelDetail?.table_config.map((config, index) => (
          <option key={index} value={config.seats}>{config.seats} seater</option>
        ))}
      </select>
      <input
        type="number"
        name="guestCount"
        value={bookingInfo.guestCount}
        onChange={handleInputChange}
        placeholder="Number of guests"
        className="border p-2 mr-2 mb-2 w-full"
      />
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="grid grid-cols-3 gap-4 text-center">
      {availableTables.map((tableNumber) => (
        <span
          key={tableNumber}
          className={`bg-gray-500 w-40 h-40 flex items-center justify-center text-white text-2xl font-bold cursor-pointer ${selectedTable === tableNumber ? 'bg-blue-500' : ''}`}
          onClick={() => handleTableSelection(tableNumber)}
        >
          {tableNumber}
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-white m-20">
      <span className="rounded-xl">
        <MdOutlineArrowBack
          className="text-black bg-slate-400 rounded-xl text-xl cursor-pointer"
          onClick={() => router.back()}
        />
      </span>
      <h2 className="text-2xl font-bold mb-4 text-black">
        {hotelDetail?.hotel_name || 'Table Booking'}
      </h2>

      {renderBookingForm()}

      {bookingInfo.tableSize && (
        <>
          <h3 className="text-xl mb-2 text-black">Select a Table ({bookingInfo.tableSize} seater)</h3>
          {renderTables()}
          <button
            onClick={handleBooking}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={!selectedTable}
          >
            Confirm Booking
          </button>
        </>
      )}

      {bookingConfirmed && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl mb-2">Booking Confirmed</h3>
          <p>Hotel: {hotelDetail.hotel_name}</p>
          <p>Table: {selectedTable}</p>
          <p>Reservation Time: {bookingInfo.reservationTime}</p>
          <p>Table Size: {bookingInfo.tableSize} seater</p>
          <p>Guests: {bookingInfo.guestCount}</p>
        </div>
      )}
    </div>
  );
};

export default Tables;