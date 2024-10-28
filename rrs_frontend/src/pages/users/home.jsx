import React, { useEffect, useState } from 'react'
import './../../app/globals.css'
import SideNav from '../../components/SideNav'
import { useRouter } from 'next/router';
import { MdLocationPin } from 'react-icons/md';
import { IoSearchOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";

const Home = () => {
  const [username, setUserName] = useState('')
  const [hotels, setHotels] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(0)
  const [user,setUser] = useState('')

  const router = useRouter()

  const fetchHotels = async() => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:8000/api/hotels', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      if (res.ok) {
        const data = await res.json()
        setAllHotels(data)
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        setHotels(shuffled.slice(0, 6))
      } else {
        throw new Error('Failed to fetch hotels')
      }
    } catch (error) {
      console.log(`Error while Fetching Hotels: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async() => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      const res = await fetch(`http://localhost:8000/api/reservations/users/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      if (res.ok) {
        const data = await res.json()
        setBooking(data)
      } else {
        throw new Error('Failed to fetch bookings')
      }
    } catch (error) {
      console.log(`Error while Fetching Bookings: ${error}`)
    }
  }

  useEffect(()=>{
    setTimeout(() => {
      fetchHotels()
    }, 1000)
    fetchBookings()
    setUser(JSON.parse(localStorage.getItem('user')))
  },[])

  useEffect(() => {
    if (search) {
      const filtered = allHotels.filter(
        hotel => hotel.hotel_name.toLowerCase().includes(search.toLowerCase()) ||
        hotel.location.toLowerCase().includes(search.toLowerCase())
      )
      setHotels(filtered)
    } else {
      const shuffled = [...allHotels].sort(() => 0.5 - Math.random())
      setHotels(shuffled.slice(0, 6))
    }
  }, [search, allHotels])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (totalRating / reviews.length).toFixed(1)
  }

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <div className="text-lg font-semibold text-slate-800">Loading...</div>
      </div>
    </div>
    )
  }

  return (
    <div className="bg-gray-100">
      <div className="bg-white shadow-md sticky top-0">
        <SideNav Badge={booking.length > 0 ? booking.length : null}/>
      </div>
      <div className="flex-1 p-10">
        <div className="mb-6 flex justify-center items-center border-2 bg-white border-gray-300  shadow-sm text-black rounded-lg">
          <div className='flex border-r-2 border-gray-300 pr-2'>
          <MdLocationPin className='text-gray-400 text-3xl ml-4' />
          {/* <select name="location" className='text-gray-400 px-0 border-r-2 border-gray-400 text-center max-w-48 bg-white' id="">
            <option>Location</option>
            <option>Chinniyampalayam</option>
            <option>Gandhipuram</option>
            <option>Singanallur</option>
            <option>Ukkadam</option>
            <option>Sulur</option>
          </select> */}
          </div>
          <input
            type="search"
            placeholder="Search hotels..."
            className="w-full p-3  h-8 focus:outline-none"
            value={search}
            onChange={handleSearchChange}
          />
          <button>
            <IoSearchOutline className='flex items-center justify-center h-12 ml-3 mx-2 bg-white text-gray-400 
            text-3xl'/>
          </button>
        </div>
        <div className='bg-white text-slate-600 p-8  rounded-md shadow-sm'>
          <p>" Discover the best dining experiences at your fingertips! Our restaurant booking app
             allows you to effortlessly find and reserve tables at your favorite local eateries or 
             explore new culinary delights. Enjoy seamless reservations, personalized recommendations, 
             and exclusive deals - all in one place. "</p>
        </div>
        { (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-wh p-10 rounded-xl">
            {hotels.map((hotel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg 
                  cursor-pointer transition-shadow duration-300 text-black"
                onClick={() => { user === null ? router.push('/users/login') : router.push(`/users/table/${hotel.id}`)}}>
                <div className=''>
                <img 
                  src={`http://localhost:8000/${hotel.image_path}`}
                  alt={hotel.hotel_name} 
                  className="w-full h-52 object-cover " 
                />
                </div>
                <div className="p-4">
                <div className='flex justify-between'>
                  <h2 className="text-xl font-semibold mb-2 capitalize">{hotel.hotel_name}</h2>
                  <span className="text-gray-600 text-sm flex items-center bg-slate-800 text-white px-1 py-0
                   rounded-md capitalize gap-1">
                    <FaStar/>{calculateAverageRating(hotel.reviews)}
                  </span>
                  </div>
                  <p className="text-gray-600 text-base flex items-center capitalize">
                    <MdLocationPin/>{hotel.location}
                  </p>  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home