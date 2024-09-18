import React from 'react'
import './../app/globals.css'

const settings = () => {
  return (
    <div>
       <div className='flex flex-col text-center'>
        <div className='bg-gray-200 ml-80 mr-80 mt-20'>
        <form  className='flex flex-col w-48 text-black'>
            <label>Hotel Name:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Hotel Image:</label>
            <input type='file' accept='image/*' className='border border-gray-600 rounded-md'/>
            <label>Hotel Location:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Hotel Description:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Contact Number:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Number of Tables</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Hotel Category:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Cuisines:</label>
            <input type='text' className='border border-gray-600 rounded-md'/>
            <label>Opening Time:</label>
            <input type='time' className='border border-gray-600 rounded-md'/>
            <label>Closing Time:</label>
            <input type='time' className='border border-gray-600 rounded-md'/>
        </form>
        <div>
          <button className='text-black w-16  rounded-md bg-[#3bfc05]'>
            save
          </button>
        </div>
        </div>
       </div>
    </div>
  )
}

export default settings
