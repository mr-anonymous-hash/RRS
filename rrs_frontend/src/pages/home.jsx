import React from 'react'
import '@/app/globals.css'
import SideNav from '@/components/SideNav'

const Home = () => {
  return (
    <div>
        <SideNav></SideNav>
      <div className='bg-gray-400 h-48 rounded-md'>
        <h1 className='font-extrabold text-2xl'>Hello, Admin</h1>
        <p>Hotel Annaporanas, Singanallore</p>
      </div>

      <div>
        <button className='border border-gray-900 bg-slate-400 w-48 h-28 rounded-md'>Tables</button>
        <button className='border border-gray-900 bg-slate-400 w-48 h-28 rounded-md'>Food Items</button>
      </div>
    </div>
  )
}

export default Home
