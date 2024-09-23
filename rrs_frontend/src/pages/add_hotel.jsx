import React, { use, useCallback, useEffect, useState } from 'react';
import './../app/globals.css';
import SideNav from '../components/SideNav';
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from 'next/router';

const AddHotels = () => {
  
  const router = useRouter()
  const [hotelData, setHotelData] = useState({
    hotel_name: '',
    location: '',
    hotel_discription: '',
    contact_number: '',
    total_tables: '',
    hotel_category: '',
    cuisines: '',
    opening_time: '',
    closing_time: '',
    adminId: ''
  });

  const [error, setError] = useState('');

  const handleInput = useCallback((e) => {
    const { name, value, type } = e.target;
    setHotelData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = ['hotel_name', 'location', 'hotel_category', 'total_tables', 'opening_time', 'closing_time','adminId'];
    const missingFields = requiredFields.filter(field => !hotelData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const dataToSend = {
      ...hotelData,
      cuisines: hotelData.cuisines.split(','), 
    };

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:8000/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
  
      if (res.ok) {
        const result = await res.json();
        console.log(`Success: ${JSON.stringify(result)}`);
        // Reset form or navigate away
      } else {
        const errorText = await res.text();
        setError(`Error: ${res.status} ${res.statusText}\n${errorText}`);
      }
    } 
    catch (error) {
      setError(`Error: ${error.message}`);
    }
    finally{
      router
    }
  };

  useEffect(()=>{
    const admin = JSON.parse(localStorage.getItem('user'))
  
    setHotelData(prevData => ({
      ...prevData,
      adminId: admin.user_id.toString()
    }));
  },[])

  
    return (
      <div className="max-w-2xl mx-auto p-6 ">
        <div className="flex items-center mb-6">
          <IoArrowBackSharp
            className="text-gray-600 cursor-pointer mr-4 text-2xl"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl font-bold text-gray-800">Add Hotel</h1>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 
        py-3 rounded mb-4" role="alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-300 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Name*</label>
              <input
                type="text"
                name="hotel_name"
                value={hotelData.hotel_name}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Location*</label>
              <input
                type="text"
                name="location"
                value={hotelData.location}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Hotel Description</label>
            <textarea
              name="hotel_discription"
              value={hotelData.hotel_discription}
              onChange={handleInput}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                value={hotelData.contact_number}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Tables*</label>
              <input
                type="number"
                name="total_tables"
                value={hotelData.total_tables}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Category*</label>
              <input
                type="text"
                name="hotel_category"
                value={hotelData.hotel_category}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisines</label>
              <input
                type="text"
                name="cuisines"
                value={hotelData.cuisines}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Opening Time*</label>
              <input
                type="time"
                name="opening_time"
                value={hotelData.opening_time}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Closing Time*</label>
              <input
                type="time"
                name="closing_time"
                value={hotelData.closing_time}
                onChange={handleInput}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>
  
          <input
            type='number'
            name='adminId'
            value={hotelData.adminId}
            onChange={handleInput}
            className='hidden'
          />
  
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent
               shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Hotel
            </button>
          </div>
        </form>
      </div>
    );
  }

export default AddHotels;