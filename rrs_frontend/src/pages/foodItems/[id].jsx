import React, { useEffect, useState } from 'react';
import './../../app/globals.css'
import axios from 'axios';
import { AiOutlineEdit } from "react-icons/ai";
import { MdBackHand, MdLocationPin, MdOutlineAddBox, MdOutlineArrowBack, MdOutlineDeleteOutline } from "react-icons/md";
import { FaUsersLine } from "react-icons/fa6";
import { useRouter } from 'next/router';

const FoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [hotel, setHotel] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newFoodItem, setNewFoodItem] = useState({
    food_name: '',
    type: '',
    cuisines: '',
    price: '',
    meal: '',
    hotelId: ''
  });
  const router = useRouter()
  const {id} = router.query

  const fetchHotel = async (id) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch hotel: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setHotel(data)
    } catch (error) {
      console.error(`Error fetching hotel: ${error}`)
      setError(`Error fetching hotel: ${error.message}`)
    }
  }

  const fetchFoodItems = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/fooditems/admin/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setFoodItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
      setFoodItems([]); // Set to empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFoodItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const hotel_id = id
    e.preventDefault();
    if (!newFoodItem.hotelId) {
      setError("Hotel ID is missing. Please try reloading the page.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:8000/api/fooditems', newFoodItem, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setIsPopupOpen(false);
      fetchFoodItems(id);
      setNewFoodItem(
        prev => ({
          ...prev,
          food_name:'',
          type: '',
          cuisines: '',
          price: '',
          meal: '',
          hotelId: hotel_id
        })
      )
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteFoodItem = async(food_id) => {
    try{
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/fooditems/${food_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      fetchFoodItems();
    }
    catch(error){
      console.log(`unable to delete ${error}`)
    }
  }

  const groupedFoodItems = Array.isArray(foodItems) 
    ? foodItems.reduce((acc, item) => {
        if (!acc[item.meal]) {
          acc[item.meal] = [];
        }
        acc[item.meal].push(item);
        return acc;
      }, {})
    : {};

  useEffect(() => {
    if(id){
      fetchHotel(id)
      fetchFoodItems(id)
      setFoodItems(prev => ({...prev, hotelId:id}))
    };
  }, [id]);

  const renderTable = (mealType) => {
    const items = groupedFoodItems[mealType] || [];
    return (
      <div className="mb-8">
        <div className='flex items-center justify-between'>
          <h2 className="text-xl font-bold mb-4 capitalize text-slate-800">{mealType}</h2>
          <button 
            onClick={() => {
              setNewFoodItem(prev => ({ ...prev, meal: mealType }));
              setIsPopupOpen(true);
            }}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <MdOutlineAddBox className="mr-1" /> Add Item
          </button>
        </div>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Cuisine</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item,index) => (
              <tr key={item.id} 
              className={`border-b hover:bg-gray-400 ${index % 2 === 1 ? 'bg-slate-300 text-white' : ''}`}>
                <td className="py-2 px-4 text-gray-600">{item.food_name}</td>
                <td className="py-2 px-4 text-gray-600">{item.type}</td>
                <td className="py-2 px-4 text-gray-600">{item.cuisines}</td>
                <td className="py-2 px-4 text-gray-600">₹{item.price.toFixed(2)}</td>
                <td className="py-2 px-4 text-gray-600">
                  <div className='flex gap-2'>
                  <button className='text-blue-500 hover:text-blue-700 mr-2' onClick={() => alert('Edit')}>
                    <AiOutlineEdit />
                  </button>
                  <button className='text-red-500 hover:text-red-700' 
                  onClick={()=>{deleteFoodItem(item.id)}}>
                    <MdOutlineDeleteOutline/>
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-lg font-semibold text-slate-800 ">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <span className=' rounded-xl'>
      <MdOutlineArrowBack className='text-black  rounded-xl text-xl cursor-pointer'
        onClick={()=>router.back()}
      />
      </span>
      <div className='flex flex-col items-center'>
        <h1 className="text-3xl font-bold mb-1 text-slate-800">{hotel.hotel_name}</h1>
        <p className='flex items-center text-slate-800'>
        <MdLocationPin className="mr-1" /> {hotel.location}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-8 text-slate-800">Food Items</h2>
      {renderTable('Breakfast')}
      {renderTable('Lunch')}
      {renderTable('Dinner')}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Add New Food Item</h2>
            <form onSubmit={handleSubmit}>
            <input
                  type="hidden"
                  name="hotelId"
                  value={newFoodItem.hotelId=id}
                />
            {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="food_name">
                  Food Name
                </label>
                <input
                  type="text"
                  id="food_name"
                  name="food_name"
                  value={newFoodItem.food_name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={newFoodItem.type}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cuisines">
                  Cuisines
                </label>
                <input
                  type="text"
                  id="cuisines"
                  name="cuisines"
                  value={newFoodItem.cuisines}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newFoodItem.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meal">
                  Meal
                </label>
                <select
                  id="meal"
                  name="meal"
                  value={newFoodItem.meal}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value=''>--select meal--</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;