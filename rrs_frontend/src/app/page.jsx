'use client'
import { useRouter } from "next/navigation";
import React, {useEffect} from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    router.push('/login') 
},[])
  return (
    <div >
        <h1>Resertaurant Reservation System</h1>
    </div>
  );
}
