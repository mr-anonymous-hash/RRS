import React from 'react'
import './../app/globals.css'

const tables = () => {
  return (
    <div className='bg-white m-20'>
      <div className='grid grid-cols-2 gap-4 text-center'>
        <span className='bg-gray-500 w-40 h-40' onClick={()=>alert('table 1')}>
            1
        </span>
        <span className='bg-gray-500 w-40 h-40'>
            2
        </span>
        <span className='bg-gray-500 w-40 h-40'>
            3
        </span>
        <span className='bg-gray-500 w-40 h-40'>
            4
        </span>
        <span className='bg-gray-500 w-40 h-40'>
            5
        </span>
        <span className='bg-gray-500 w-40 h-40'>
            6
        </span>
      </div>
    </div>
  )
}

export default tables
