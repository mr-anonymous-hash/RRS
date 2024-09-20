import React, { useCallback, useState } from 'react';
import './../app/globals.css';
import SideNav from '../components/SideNav';

const Settings = () => {
  const [hotelData, setHotelData] = useState({
    hotel_name: '',
    location: '',
    hotel_discription: '',
    contact_number: '',
    total_tables: '',
    hotel_category: '',
    cuisines: '',
    opening_time: '',
    closing_time: ''
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

    const requiredFields = ['hotel_name', 'location', 'hotel_category', 'total_tables', 'opening_time', 'closing_time'];
    const missingFields = requiredFields.filter(field => !hotelData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const dataToSend = {
      ...hotelData,
      cuisines: hotelData.cuisines.split(','), // Convert to array
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
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex">
      <div>
        <SideNav />
      </div>
      <div className="flex flex-col text-center">
        <div className="bg-gray-200 ml-80 mr-80 mt-20 p-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            className="flex flex-col text-black"
            onSubmit={handleSubmit}
          >
            <label>Hotel Name:*</label>
            <input
              type="text"
              name="hotel_name"
              value={hotelData.hotel_name}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <label>Hotel Location:*</label>
            <input
              type="text"
              name="location"
              value={hotelData.location}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <label>Hotel Description:</label>
            <input
              type="text"
              name="hotel_discription"
              value={hotelData.hotel_discription}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
            />
            <label>Contact Number:</label>
            <input
              type="text"
              name="contact_number"
              value={hotelData.contact_number}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
            />
            <label>Number of Tables:*</label>
            <input
              type="number"
              name="total_tables"
              value={hotelData.total_tables}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <label>Hotel Category:*</label>
            <input
              type="text"
              name="hotel_category"
              value={hotelData.hotel_category}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <label>Cuisines:</label>
            <input
              type="text"
              name="cuisines"
              value={hotelData.cuisines}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
            />
            <label>Opening Time:*</label>
            <input
              type="time"
              name="opening_time"
              value={hotelData.opening_time}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <label>Closing Time:*</label>
            <input
              type="time"
              name="closing_time"
              value={hotelData.closing_time}
              onChange={handleInput}
              className="border border-gray-600 rounded-md"
              required
            />
            <button type="submit" className="text-black w-16 rounded-md bg-[#84db6c] mt-4">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;