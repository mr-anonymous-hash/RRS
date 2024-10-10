import React from 'react'
import './../app/globals.css'
import SideNav from '../components/SideNav'
import { useRouter } from 'next/navigation'

const settings = () => {
  const router = useRouter()
  return (
    <div className='flex'>
      <div>
        <SideNav />
      </div>
      <div>
      <div className='text-white text-center bg-slate-500 
        ml-10 mt-10 rounded-lg min-h-28 min-w-60 cursor-pointer
        hover:bg-slate-300 hover:text-slate-500 flex items-center justify-center'
        onClick={()=>router.push('/add_hotel')}>
          <p className='text-xl'>Add Hotels</p>  
        </div>
        <div className='text-white text-center bg-slate-500 
        ml-10 mt-10 rounded-lg min-h-28 min-w-60 cursor-pointer
        hover:bg-slate-300 hover:text-slate-500 flex items-center justify-center'
        onClick={()=>router.push('/add_hotel')}>
          <p className='text-xl'>Update Hotels</p>  
        </div>
      </div>
    </div>
  )
}

export default settings
