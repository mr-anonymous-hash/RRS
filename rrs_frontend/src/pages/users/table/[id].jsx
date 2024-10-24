import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import { useRouter } from 'next/router';
import { MdAccessTime, MdLocationPin, MdOutlineArrowBack } from 'react-icons/md';
import FoodSelection from './../../../components/FoodSelection';
import { FaStar } from "react-icons/fa";

const Tables = () => {
  const [user,setUser] = useState(null)
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
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewPopup, setReviewPopup] = useState(false) 
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);

  const router = useRouter();

  const calculateRating = (reviews)=>{
    if(!reviews || reviews.length === 0){
      return 0;
    }
    const sum = reviews.reduce((acc, review)=> acc+ review.rating,0)
    return (sum/reviews.length).toFixed(1)
  }

  const isAlreadyReviewd = ()=>{
    if(!user || !user.user_id){
      return false;
    }
    const AlreadyReviewd = reviews.some(review => review.userId === user.user_id) 
    if(AlreadyReviewd){
      setIsReviewed(true)
    } 
  }

  const fetchHotelDetails = async (id) => {
  const token = localStorage.getItem('token');

    try {
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
  const token = localStorage.getItem('token');

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

  const fetchReviews = async(id)=>{
  const token = localStorage.getItem('token');

    try{
      const res = await fetch(`http://localhost:8000/api/reviews/hotel/${id}`,
        {
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type' : 'application/json'
          }
        })
        if(res.ok){
          const data = await res.json()
          console.log(data) 
          setReviews(data)
        }
    }catch(error){
      console.error(`Error while fetching reviews ${error}`)
    }
  }

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleReviewSubmit = async () => {
    setReviewError(null);
    setSuccessMessage('');
    setIsSubmittingReview(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.user_id) {
        throw new Error('Please log in to submit a review');
      }

      const token = localStorage.getItem('token');
      const reviewData = {
        rating: rating,
        comment: reviewComment,
        userId: user.user_id,
        hotelId: router.query.id
      };

      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Review submitted successfully!');
        // Reset form
        setRating(0);
        setReviewComment('');
        // Refresh reviews
        fetchReviews(router.query.id);
        // Close popup after delay
        setTimeout(() => {
          setReviewPopup(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
    } catch (error) {
      setReviewError(error.message || 'An error occurred while submitting the review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (router.query.id){ 
      fetchHotelDetails(router.query.id); 
      fetchReservations(router.query.id)
      fetchReviews(router.query.id)
    }
  }, [router.query.id]);

  useEffect(()=>{
    isAlreadyReviewd()
  },[reviews])

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

  // const renderBookingForm = () => (
  //   <div className='flex justify-between mt-6'>
  //     <div className='min-w-[600px] rounded shadow-md'
  //     style={{backgroundImage: `url(http://localhost:8000/${hotelDetail?.image_path})`, 
  //     backgroundSize: 'cover', 
  //     backgroundPosition: 'center', 
  //     backgroundRepeat: 'no-repeat'}}
  //     ></div>
  //     <div className="mt-0 p-4 border min-w-[500px] rounded">
  //     <h3 className="text-xl mb-2 text-slate-800">Book Table</h3>
  //     <div className='text-slate-800'>
  //       <input 
  //         type="date"
  //         name='reservationDate'
  //         value={bookingInfo.reservationDate || ''}
  //         onChange={handleInputChange}
  //         className="border p-2 mr-2 mb-2 w-full" />
  //      <div className='flex justify-between'>
  //      <input
  //         type="time"
  //         name="reservationStartTime"
  //         placeholder='Start Time'
  //         value={bookingInfo.reservationStartTime}
  //         onChange={handleInputChange}
  //         className="border p-2 mr-2 mb-2 w-full"
  //       />  
  //       <input
  //         type="time"
  //         name="reservationEndTime"
  //         placeholder='End Time'
  //         value={bookingInfo.reservationEndTime}
  //         onChange={handleInputChange}
  //         className="border p-2  mb-2 w-full"
  //       />
  //      </div>

  //       <select
  //         name="tableSize"
  //         value={bookingInfo.tableSize}
  //         onChange={handleInputChange}
  //         className="border p-2 mr-2 mb-2 w-full"
  //       >
  //         <option value="" className='text-gray-900'>Select table size</option>
  //         {hotelDetail?.table_config.map((config, index) => (
  //           <option key={index} value={config.seats}>{config.seats} seater</option>
  //         ))}
  //       </select>
  //       <input
  //         type="number"
  //         name="guestCount"
  //         value={bookingInfo.guestCount}
  //         onChange={handleInputChange}
  //         placeholder="Number of guests"
  //         className="border p-2 mr-2 mb-2 w-full"
  //       />
  //     </div>
  //   </div>
  //   </div>

  // );

  // const renderTables = () => (
  //   <div className="grid grid-cols-3 gap-4 text-center">
  //     {availableTables.map((tableNumber) => {
  //       const isBooked = isTableBooked(tableNumber);
  //       return (
  //         <div
  //           key={tableNumber}
  //           className={`relative bg-gray-200 w-40 h-40 flex flex-col items-center justify-center
  //             text-slate-800 cursor-pointer rounded-lg
  //             ${selectedTables.includes(tableNumber) ? 'border-4 border-blue-500' : ''}
  //             ${isBooked ? 'bg-red-200 cursor-not-allowed' : ''}`}
  //           onClick={() => !isBooked && handleTableSelection(tableNumber)}
  //         >
  //           <div className="text-2xl font-bold mb-2">Table {tableNumber}</div>
  //           <div className="flex flex-wrap justify-center">
  //             {Array.from({ length: parseInt(bookingInfo.tableSize) }, (_, i) => (
  //               <div key={i} className="w-6 h-6 m-1 bg-gray-400 rounded-full"></div>
  //             ))}
  //           </div>
  //           {isBooked && <div className="absolute inset-0 flex items-center justify-center
  //            bg-red-500 bg-opacity-50 hover:cursor-not-allowed text-white rounded-lg font-bold">Booked</div>}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Back Button */}
      <div className="flex items-center justify-start space-x-2 mb-6">
        <span className="rounded-full text-2xl">
          <MdOutlineArrowBack
            className="text-black rounded-full text-xl cursor-pointer"
            onClick={() => router.back()}
          />
        </span>
      </div>

      {/* Hotel Details and Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Hotel Details */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Hotel Image */}
            <div 
              className="w-full h-64 rounded-lg mb-6 bg-cover bg-center"
              style={{
                backgroundImage: hotelDetail?.image_path 
                  ? `url(http://localhost:8000/${hotelDetail.image_path})`
                  : 'none'
              }}
            />
            
            {/* Hotel Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800 capitalize">
                  {hotelDetail?.hotel_name || 'Loading...'}
                </h1>
                <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {calculateRating(reviews)}<FaStar/>
                </span>
              </div>

              <p className="text-slate-600">
                {hotelDetail?.hotel_description || 'Loading description...'}
              </p>

              <div className="flex flex-wrap gap-4 text-slate-600">
                <p className="flex items-center gap-2 text-slate-500 capitalize">
                  <MdLocationPin className="text-slate-800 text-lg" />
                  <span >{hotelDetail?.location || 'Loading location...'}</span>
                </p>
                <div className="flex items-center gap-2 text-slate-500">
                  <MdAccessTime className="text-slate-800 text-lg" />
                  <span>
                    {hotelDetail ? (
                      `${new Date(`1970-01-01T${hotelDetail.opening_time}`).toLocaleTimeString([], 
                        { hour: '2-digit', minute: '2-digit', hour12: true })} - 
                       ${new Date(`1970-01-01T${hotelDetail.closing_time}`).toLocaleTimeString([], 
                        { hour: '2-digit', minute: '2-digit', hour12: true })}`
                    ) : 'Loading hours...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Reviews Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Rating Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-6">
              <div>
                <button className="flex items-center p-2 bg-lime-400 rounded-md gap-1 font-semibold">
                  {calculateRating(reviews)} <FaStar/>
                </button>
                <p className="text-slate-800 mt-2">{reviews.length} Votes</p>
                <p className="text-slate-800 mt-1 text-sm">{reviews.length} reviews</p>
              </div>
              <div className="flex justify-center items-center">
                {
                  isReviewed === false ? (<div>
                    <div className="flex gap-2 p-4 text-xl" onClick={() => setReviewPopup(true)}>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <FaStar key={index} className="border w-6 h-6 p-1 cursor-pointer" />
                      ))}
                    </div>
                    <p className="text-slate-800 text-md text-center">Rate This Place</p>
                  </div>) : (<div className="flex flex-col items-center justify-center">
                    <p className="text-slate-800 text-md">You have already reviewed this place</p>
                    <p className="text-slate-800 text-md">Thank you for your feedback!</p>
                  </div>)
                }
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Recent Reviews</h3>
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, index) => (
                        <FaStar key={index} className="text-yellow-400 w-4 h-4" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, index) => (
                        <FaStar key={index + review.rating} className="text-gray-300 w-4 h-4" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-slate-500 text-center py-4">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 ">Make a Reservation</h2>
          
          {/* Booking Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Booking Form */}
            <div className="space-y-4 text-slate-600">
              <input 
                type="date"
                name="reservationDate"
                value={bookingInfo.reservationDate || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  name="reservationStartTime"
                  value={bookingInfo.reservationStartTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  name="reservationEndTime"
                  value={bookingInfo.reservationEndTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                name="tableSize"
                value={bookingInfo.tableSize}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select table size</option>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Table Selection */}
            {bookingInfo.tableSize && (
              <div className='mt-0'>
                <h1 className='text-2xl font-bold text-slate-800 '>Choose Your Table</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTables.map((tableNumber) => {
                  const isBooked = isTableBooked(tableNumber);
                  return (

                    <div
                      key={tableNumber}
                      onClick={() => !isBooked && handleTableSelection(tableNumber)}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${isBooked ? 'bg-red-50 border-red-200 cursor-not-allowed' : 'bg-white hover:border-blue-400 cursor-pointer'}
                        ${selectedTables.includes(tableNumber) ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}
                      `}
                    >
                      <div className="text-lg font-semibold mb-2 text-slate-800"> #{tableNumber}</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: parseInt(bookingInfo.tableSize) }, (_, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 rounded-full bg-slate-300"
                          />
                        ))}
                      </div>
                      {isBooked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-90 rounded-lg">
                          <span className="font-semibold text-red-600">Booked</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </div>
            )}
          </div>

          {/* Food Selection */}
          {
            selectedTables.length > 0 && (
              <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Select Your Food</h3>
              <FoodSelection 
                hotelId={router.query.id} 
                onFoodSelect={handleFoodSelection}
              />
            </div>
            )
          }

          {/* Booking Button */}
          {
            selectedFood.length > 0 && (
              <button
            onClick={handleBooking}
            disabled={isLoading || selectedTables.length === 0}
            className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Confirming...' : 'Confirm Booking'}
          </button>
            )
          }

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 border rounded-lg bg-red-50 text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {bookingConfirmed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-center">
            <h3 className="text-xl font-bold text-green-600">Booking Confirmed</h3>
          </div>
        </div>
      )}

      {/* Review Popup Modal */}
      {reviewPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-55 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 w-[650px] relative">
            <button 
              onClick={() => {
                setReviewPopup(false);
                setReviewError(null);
                setSuccessMessage('');
                setRating(0);
                setReviewComment('');
              }} 
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Rate Your Experience</h2>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <FaStar
                    key={starValue}
                    className={`text-2xl cursor-pointer transition-colors
                      ${rating >= starValue ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => handleStarClick(starValue)}
                  />
                ))}
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with us..."
                className="w-full h-40 p-4 border text-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              />

              {reviewError && (
                <div className="text-red-500 mt-4">{reviewError}</div>
              )}

              {successMessage && (
                <div className="text-green-500 mt-4">{successMessage}</div>
              )}

              <button 
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview || !rating || !reviewComment.trim()}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;