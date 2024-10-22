'use client'
import { useRouter } from "next/navigation";
import React, {useEffect, useState} from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    try{
      router.push('/users/home')
    }finally{
      setTimeout(()=>setLoading(false),1000)
    } 
},[])

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
}
