import React, { useEffect, useState } from 'react'
import './../../app/globals.css'
import SideNav from '../../components/SideNav'
import { useRouter } from 'next/router';
import { MdLocationPin } from 'react-icons/md';
import { IoSearchOutline } from "react-icons/io5";

const Home = () => {
  const [username, setUserName] = useState('')
  const [hotels, setHotels] = useState([])
  const [allHotels, setAllHotels] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
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

   useEffect(() => {
    const user = localStorage.getItem('user')
    try {
      const userObject = JSON.parse(user)
      if (user) {
        setUserName(userObject.name)
        setTimeout(() => {
          fetchHotels()
        }, 1000)
      }
    } catch (error) {
      console.error(`Error user name not found: ${error}`)
    }
  }, [])

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
      <div className="bg-white shadow-md">
        <SideNav/>
      </div>
      <div className="flex-1 p-10">
        <header className=" text-slate-800 px-6 rounded-lg  mb-8 flex justify-center">
          {/* <h1 className="text-4xl font-bold capitalize ">TableTime</h1> */}
        </header>
        <div className="mb-6 flex justify-center items-center border bg-white border-gray-200 shadow-sm text-black rounded-lg">
          <MdLocationPin className='text-gray-400 text-3xl ml-4' />
          <select name="location" className='text-gray-400 px-0 border-r-2 border-gray-400 text-center w-60 bg-white' id="">
            <option value="">Location</option>
            <option>Chinniyampalayam</option>
            <option>Gandhipuram</option>
            <option>Singanallur</option>
            <option>Ukkadam</option>
            <option>Sulur</option>
          </select>
          <IoSearchOutline className='flex items-center justify-center h-12 ml-3 bg-white text-gray-400 text-3xl'/>
          <input
            type="search"
            placeholder="Search hotels..."
            className="w-full p-3  h-8 focus:outline-none"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className='bg-white text-slate-400 p-8  rounded-md shadow-sm'>
          <p>" Discover the best dining experiences at your fingertips! Our restaurant booking app
             allows you to effortlessly find and reserve tables at your favorite local eateries or 
             explore new culinary delights. Enjoy seamless reservations, personalized recommendations, 
             and exclusive deals - all in one place. "</p>
        </div>
        { (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-wh p-10 rounded-xl">
            {hotels.map((hotel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 text-black"
                onClick={() => router.push(`/users/hotel/${hotel.id}`)}>
                <div className=''>
                <img 
                  src={`http://localhost:8000/${hotel.image_path}`}
                  alt={hotel.hotel_name} 
                  className="w-full h-52 object-cover " 
                />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 capitalize">{hotel.hotel_name}</h2>
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