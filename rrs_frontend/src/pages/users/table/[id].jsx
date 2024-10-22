import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import { useRouter } from 'next/router';
import { MdAccessTime, MdLocationPin, MdOutlineArrowBack } from 'react-icons/md';
import FoodSelection from './../../../components/FoodSelection';
import SideNav from '../../../components/SideNav';

const Tables = () => {
  const [hotelDetail, setHotelDetail] = useState(null);
  const [reservations, setReservations] = useState([]); // Changed to plural and initialized as an array
  const [bookingInfo, setBookingInfo] = useState({
    reservationDate: '',
    reservationStartTime: '',
    reservationEndTime: '',
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

  const fetchReservations = async(hotelId) => {
    const token = localStorage.getItem('token')
    try {
          const res = await fetch(`http://localhost:8000/api/reservations/hotel/${hotelId}`,
        {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type' : 'application/json'
          }
        }
      )

      if(res.ok){
        const data = await res.json()
        setReservations(data)
      }
      else{
        console.error('Unable to fetch reservations')
      }
    }
    catch(error){
      console.error(`Error while fetching reservations ${error}`)
    }
  }

  useEffect(() => {
    if (router.query.id){ 
      fetchHotelDetails(router.query.id); 
      fetchReservations(router.query.id)
    }
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

  const isTableBooked = (tableNumber) => {
    return reservations.some(res => 
      res.table_size === parseInt(bookingInfo.tableSize) && 
      res.selected_tables.includes(tableNumber)
    );
  };

  const handleTableSelection = (tableNumber) => {
    if (isTableBooked(tableNumber)) return; 
    
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
    if (!bookingInfo.reservationDate) {
      setError('Please select a reservation Date.');
      return false;
    }
    if (!bookingInfo.reservationStartTime) {
      setError('Please select a reservation start time.');
      return false;
    }
    if (!bookingInfo.reservationEndTime) {
      setError('Please select a reservation end time.');
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
        table_size: parseInt(bookingInfo.tableSize),
        selected_food: selectedFood.map(food => food.id),
        reservation_date: bookingInfo.reservationDate,
        reservation_start_time: bookingInfo.reservationStartTime,
        reservation_end_time: bookingInfo.reservationEndTime,
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
        setTimeout(() => {
          router.push(`/users/home`)
        }, 1500);
        fetchReservations(); // Refresh reservations after booking
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
    <div className='flex justify-between mt-6'>
      <div className='min-w-[600px] rounded shadow-md'
      style={{backgroundImage: `url(http://localhost:8000/${hotelDetail?.image_path})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat'}}
      ></div>
      <div className="mt-0 p-4 border min-w-[500px] rounded">
      <h3 className="text-xl mb-2 text-slate-800">Book Table</h3>
      <div className='text-slate-800'>
        <input 
          type="date"
          name='reservationDate'
          value={bookingInfo.reservationDate || ''}
          onChange={handleInputChange}
          className="border p-2 mr-2 mb-2 w-full" />
       <div className='flex justify-between'>
       <input
          type="time"
          name="reservationStartTime"
          placeholder='Start Time'
          value={bookingInfo.reservationStartTime}
          onChange={handleInputChange}
          className="border p-2 mr-2 mb-2 w-full"
        />  
        <input
          type="time"
          name="reservationEndTime"
          placeholder='End Time'
          value={bookingInfo.reservationEndTime}
          onChange={handleInputChange}
          className="border p-2  mb-2 w-full"
        />
       </div>

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
    </div>

  );

  const renderTables = () => (
    <div className="grid grid-cols-3 gap-4 text-center">
      {availableTables.map((tableNumber) => {
        const isBooked = isTableBooked(tableNumber);
        return (
          <div
            key={tableNumber}
            className={`relative bg-gray-200 w-40 h-40 flex flex-col items-center justify-center
              text-slate-800 cursor-pointer rounded-lg
              ${selectedTables.includes(tableNumber) ? 'border-4 border-blue-500' : ''}
              ${isBooked ? 'bg-red-200 cursor-not-allowed' : ''}`}
            onClick={() => !isBooked && handleTableSelection(tableNumber)}
          >
            <div className="text-2xl font-bold mb-2">Table {tableNumber}</div>
            <div className="flex flex-wrap justify-center">
              {Array.from({ length: parseInt(bookingInfo.tableSize) }, (_, i) => (
                <div key={i} className="w-6 h-6 m-1 bg-gray-400 rounded-full"></div>
              ))}
            </div>
            {isBooked && <div className="absolute inset-0 flex items-center justify-center
             bg-red-500 bg-opacity-50 hover:cursor-not-allowed text-white rounded-lg font-bold">Booked</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    
    <div className="bg-white m-10">
      
      <div className="flex items-center justify-start space-x-2">
        <span className="rounded-full bg-slate-400 text-2xl">
          <MdOutlineArrowBack
            className="text-black rounded-full text-xl cursor-pointer"
            onClick={() => router.back()}
          />
        </span>
        {/* <h2 className="text-2xl font-bold text-slate-800 capitalize">
          {hotelDetail?.hotel_name || 'Table Booking'}
        </h2> */}
      </div>

      {renderBookingForm()}
      
      <div className='mt-4'>
      <h1 className="text-3xl font-bold text-slate-800 capitalize">
          {hotelDetail?.hotel_name || 'Table Booking'}
        </h1>
        <div className='w-[750px] mt-2'>
        <p className='text-base text-slate-500'>{hotelDetail?.hotel_description}</p>
        <div className=' flex justify-between items-center '>
        <p className='text-slate-500 p-2 flex items-center capitalize'>
                  <MdLocationPin className='text-slate-800' />{hotelDetail?.location}
                </p>
                <div className='px-4 flex justify-between items-center'>
                  <div className='flex gap-2 items-center text-slate-500'>
                    <MdAccessTime className='text-slate-800'/>
                    <p >{new Date(`1970-01-01T${hotelDetail?.opening_time}`).toLocaleTimeString([],
                      { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(`1970-01-01T${hotelDetail?.closing_time}`).toLocaleTimeString([],
                        { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  </div>
                </div>
        </div>
        </div>
      </div>
      {bookingInfo.tableSize && (
        <div className='mt-8'>
          <h3 className="text-2xl mb-2 font-bold text-slate-800">Choose Your Table </h3>
          {renderTables()}
          <FoodSelection 
            hotelId={router.query.id} 
            onFoodSelect={handleFoodSelection}
          />
          <button
            onClick={handleBooking}
            className="mt-4 bg-blue-500 text-white px-4 py-2 font-bold rounded w-full"
            disabled={isLoading || selectedTables.length === 0}
          >
            {isLoading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 border rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {bookingConfirmed && (
         <div className='fixed inset-0 bg-black bg-opacity-55 min-w-screen max-h-screen'>
         <div className='flex justify-center m-[250px]'>
         <div className="mt-4 p-4 border rounded w-[380px] flex justify-center items-center min-h-40  bg-white text-green-700">
             <h3 className="text-xl  font-extrabold mb-2">Booking Confirmed</h3>
           </div>
         </div>
         </div>
      )}

     
    </div>
  );
};

export default Tables;