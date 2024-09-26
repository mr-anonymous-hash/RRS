import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import { useRouter } from 'next/router';
import { MdOutlineArrowBack } from 'react-icons/md';
import FoodSelection from './../../../components/FoodSelection';

const Tables = () => {
  const [hotelDetail, setHotelDetail] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    reservationTime: '',
    tableSize: '',
    guestCount: '',
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      } else {
        throw new Error('Failed to fetch hotel details');
      }
    } catch (error) {
      console.error(`Error while fetching hotel details: ${error}`);
      setError('Failed to load hotel details. Please try again.');
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
      setSelectedTables([]);  
    }
  };

  const updateAvailableTables = (selectedSeats) => {
    if (hotelDetail && hotelDetail.table_config) {
      const config = hotelDetail.table_config.find(c => c.seats === selectedSeats);
      if (config) {
        setAvailableTables(Array.from({ length: config.Tables }, (_, i) => i + 1));
      } else {
        setAvailableTables([]);
      }
    }
  };

  const handleTableSelection = (tableNumber) => {
    setSelectedTables(prevSelected => {
      if (prevSelected.includes(tableNumber)) {
        return prevSelected.filter(t => t !== tableNumber);
      } else {
        return [...prevSelected, tableNumber];
      }
    });
  };

  const handleFoodSelection = (selectedFoodItems) => {
    setSelectedFood(selectedFoodItems);
  };

  const validateForm = () => {
    if (!bookingInfo.reservationTime) {
      setError('Please select a reservation time.');
      return false;
    }
    if (!bookingInfo.tableSize) {
      setError('Please select a table size.');
      return false;
    }
    if (!bookingInfo.guestCount || parseInt(bookingInfo.guestCount) <= 0) {
      setError('Please enter a valid number of guests.');
      return false;
    }
    if (selectedTables.length === 0) {
      setError('Please select at least one table.');
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.user_id) {
        throw new Error('User information not found. Please log in again.');
      }
      const userId = user.user_id;
      
      const reservationData = {
        no_of_guests: parseInt(bookingInfo.guestCount),
        selected_tables: selectedTables,
        reserved_tables: selectedTables.length,
        selected_food: selectedFood.map(food => food.id),
        reservation_time: bookingInfo.reservationTime,
        status: 'pending',
        hotelId: hotelDetail.id,
        userId: userId,
      };

      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Reservation created:', result);
        setBookingConfirmed(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error.message || 'An error occurred while creating the reservation. Please try again.');
    } finally {
      setIsLoading(false);
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
        <div
          key={tableNumber}
          className={`relative bg-gray-200 w-40 h-40 flex flex-col items-center justify-center
             text-black cursor-pointer rounded-lg
             ${selectedTables.includes(tableNumber) ? 'border-4 border-blue-500' : ''}`}
          onClick={() => handleTableSelection(tableNumber)}
        >
          <div className="text-2xl font-bold mb-2">Table {tableNumber}</div>
          <div className="flex flex-wrap justify-center">
            {Array.from({ length: parseInt(bookingInfo.tableSize) }, (_, i) => (
              <div key={i} className="w-6 h-6 m-1 bg-gray-400 rounded-full"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white m-20">
      <div className="flex items-center justify-start space-x-2">
        <span className="rounded-full bg-slate-400 ">
          <MdOutlineArrowBack
            className="text-black rounded-full text-xl cursor-pointer"
            onClick={() => router.back()}
          />
        </span>
        <h2 className="text-2xl font-bold text-black">
          {hotelDetail?.hotel_name || 'Table Booking'}
        </h2>
      </div>

      {renderBookingForm()}

      {bookingInfo.tableSize && (
        <>
          <h3 className="text-xl mb-2 text-black">Select Tables ({bookingInfo.tableSize} seater)</h3>
          {renderTables()}
          <FoodSelection 
            foodItems={hotelDetail?.fooditems || []} 
            onFoodSelect={handleFoodSelection}
          />
          <button
            onClick={handleBooking}
            className="mt-4 bg-blue-500 text-white px-4 py-2 font-bold rounded w-full"
            disabled={isLoading || selectedTables.length === 0}
          >
            {isLoading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </>
      )}

      {error && (
        <div className="mt-4 p-4 border rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {bookingConfirmed && (
        <div className="mt-4 p-4 border rounded bg-green-100 text-green-700">
          <h3 className="text-xl  mb-2">Booking Confirmed</h3>
          <p>Hotel: {hotelDetail.hotel_name}</p>
          <p>Tables: {selectedTables.join(', ')}</p>
          <p>Reservation Time: {bookingInfo.reservationTime}</p>
          <p>Table Size: {bookingInfo.tableSize} seater</p>
          <p>Guests: {bookingInfo.guestCount}</p>
          <p>Selected Food: {selectedFood.map(food => food.food_name).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default Tables;