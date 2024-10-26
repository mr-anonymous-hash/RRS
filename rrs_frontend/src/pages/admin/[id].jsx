import React, { useEffect, useState } from 'react';
import './../../app/globals.css'
import { LuLoader2 } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { GiWoodenChair } from "react-icons/gi";
import { LiaUtensilsSolid } from "react-icons/lia";
import { useRouter } from 'next/router';
import SideNav from '../../components/SideNav';

const RestaurantAdmin = () => {
  const [restaurant, setRestaurant] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const fetchRestaurant = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/hotels/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setRestaurant(data);
      } else {
        throw new Error('Failed to fetch restaurant details');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.id) {
      fetchRestaurant(router.query.id);
    }
  }, [router.query.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LuLoader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  console.log(restaurant)

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <SideNav/>
    <div className="min-h-screen bg-slate-100 p-8">
      
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-center text-3xl font-bold text-slate-800 capitalize">
            {restaurant?.hotel_name }
          </h1>
          {/* <div className="mb-6 max-w-lg mx-auto aspect-video overflow-hidden rounded-lg">
            <img
              src={`http://localhost:8000/${restaurant?.image_path}`}
              alt={restaurant?.hotel_name}
              className="h-full w-full object-cover"
            />
          </div> */}
          <p className="mb-4 text-slate-600 leading-relaxed">
            {restaurant?.hotel_description}
          </p>
          <div className="flex items-center gap-2 text-slate-600">
            <FaLocationDot className="h-5 w-5" />
            <span className="capitalize">{restaurant?.location}</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <button className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col items-center text-slate-700 gap-4"
            onClick={()=>router.push(`/admin/bookings/${restaurant?.id}`)}>
              <GiWoodenChair className="h-12 w-12  transition-colors group-hover:text-blue-600" />
              <h3 className="text-xl font-semibold group-hover:text-blue-600">Manage Bookings</h3>
            </div>
          </button>
          <button className="group rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col items-center text-slate-700 gap-4"
            onClick={()=>router.push(`/foodItems/${restaurant?.id}`)}>
              <LiaUtensilsSolid className="h-12 w-12 text-slate-700 transition-colors group-hover:text-blue-600" />
              <h3 className="text-xl font-semibold group-hover:text-blue-600">Manage Menu</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RestaurantAdmin;