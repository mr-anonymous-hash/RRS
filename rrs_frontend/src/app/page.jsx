'use client'
import React, {useEffect} from "react";

export default function Home() {
  useEffect(()=>{
    window.location.href = '/signin'
},[])
  return (
    <div >
        <h1>Resertaurant Reservation System</h1>
    </div>
  );
}
