import React, { useCallback, useEffect, useState } from 'react';
import './../app/globals.css';
import { IoArrowBackSharp } from "react-icons/io5";
import { useRouter } from 'next/router';
import Popup from '../components/Popup';

const AddHotels = () => {
  const router = useRouter();
  const [hotelData, setHotelData] = useState({
    hotel_name: '',
    location: '',
    hotel_description: '',
    contact_number: '',
    total_tables: '',
    table_config: [],
    hotel_category: '',
    cuisines: '',
    opening_time: '',
    closing_time: '',
    adminId: ''
  });

  const [image, setImage] = useState(null);
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState('');

  const handleInput = useCallback((e) => {
    const { name, value, type } = e.target;
    setHotelData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  }, []);

  const handleTableConfigChange = useCallback((index, field, value) => {
    setHotelData(prevData => {
      const updatedConfig = [...prevData.table_config];
      updatedConfig[index] = { ...updatedConfig[index], [field]: parseInt(value, 10) };
      return { ...prevData, table_config: updatedConfig };
    });
  }, []);

  const addTableConfig = useCallback(() => {
    setHotelData(prevData => ({
      ...prevData,
      table_config: [...prevData.table_config, { seats: '', Tables: '' }]
    }));
  }, []);

  const removeTableConfig = useCallback((index) => {
    setHotelData(prevData => ({
      ...prevData,
      table_config: prevData.table_config.filter((_, i) => i !== index)
    }));
  }, []);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['hotel_name', 'location', 'hotel_category', 'total_tables',
       'opening_time', 'closing_time', 'adminId'];
    const missingFields = requiredFields.filter(field => !hotelData[field]);
    
    if (missingFields.length > 0) {
      setMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setPopup(true);
      return;
    }

    const formData = new FormData();
    Object.keys(hotelData).forEach(key => {
      if (hotelData[key] !== '') {
        if (key === 'table_config') {
          formData.append(key, JSON.stringify(hotelData[key]));
        } else {
          formData.append(key, hotelData[key]);
        }
      }
    });
    if (image) {
      formData.append('hotel_image', image);
    }

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:8000/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (res.ok) {
        const result = await res.json();
        setMessage('Hotel added Successfully');
        setPopup(true);
        setTimeout(() => router.push(`/settings`), 800);
        console.log(`Success: ${JSON.stringify(result)}`);
      } else {
        const errorText = await res.text();
        setMessage(`Error: ${res.status} ${res.statusText}\n${errorText}`);
        setPopup(true);
      }
    } 
    catch (error) {
      setMessage(`Error: ${error.message}`);
      setPopup(true);
    }
  };

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('user'));
    setHotelData(prevData => ({
      ...prevData,
      adminId: admin.user_id.toString()
    }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <IoArrowBackSharp
          className="text-gray-600 cursor-pointer mr-4 text-2xl"
          onClick={() => router.back()}
        />
        <h1 className="text-3xl font-bold text-gray-800">Add Hotel</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-300 p-4 rounded-md text-black">
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
      name="hotel_description"
      value={hotelData.hotel_description}
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
        type="tel"
        name="contact_number"
        value={hotelData.contact_number}
        onChange={handleInput}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Total Number of Tables*</label>
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
  
  <div>
    <label className="block text-sm font-medium text-gray-700">Table Configuration*</label>
    {hotelData.table_config.map((config, index) => (
      <div key={index} className="flex space-x-2 mt-2">
        <input
          type="number"
          placeholder="Seats"
          value={config.seats}
          onChange={(e) => handleTableConfigChange(index, 'seats', e.target.value)}
          className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
        <input
          type="number"
          placeholder="Tables"
          value={config.count}
          onChange={(e) => handleTableConfigChange(index, 'Tables', e.target.value)}
          className="mt-1 block w-1/3 rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
        <button
          type="button"
          onClick={() => removeTableConfig(index)}
          className="mt-1 px-2 py-1 bg-red-500 text-white rounded-md"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addTableConfig}
      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded-md"
    >
      Add Table Configuration
    </button>
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

  <div>
    <label className="block text-sm font-medium text-gray-700">Hotel Image</label>
    <input
      type="file"
      onChange={handleImage}
      className="mt-1 block w-full"
      accept="image/*"
    />
  </div>

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
      
      <Popup
        title={message.includes('Successfully') ? 'Success' : 'Error'}
        message={message}
        isOpen={popup}
        autoCloseDuration={800}
      />
    </div>
  );
}

export default AddHotels;