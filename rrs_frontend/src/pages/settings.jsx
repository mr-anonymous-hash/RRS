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
        <div className='text-black text-center bg-slate-300 
        ml-10 mt-10 rounded-lg min-h-60 min-w-60 cursor-pointer hover:bg-slate-200'
        onClick={()=>router.push('/add_hotel')}>
          <p className='py-24'>Add Hotels</p>  
        </div>
      </div>
    </div>
  )
}

export default settings
