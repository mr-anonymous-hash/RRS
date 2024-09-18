import React from 'react'
import './../../app/globals.css'

const home = () => {
  return (
    <div className='flex flex-col gap-5 text-center '>
      <div className='text-black text-center bg-sky-500 h-20 rounded-lg'>
        <h1 className='font-extrabold text-2xl'>Welcome, Sibi</h1>
      </div>
      <div className=''>
        <div>
        <input type='search' placeholder='search...' className='border border-gray-500 h-10 w-60 rounded-md'/>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-10 place-content-center'>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
            <span className='bg-slate-400 h-40 w-40 ml-40'>Hotel</span>
        </div>
      </div>
    </div>
  )
}

export default home
