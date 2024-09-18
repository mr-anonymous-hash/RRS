import React, { useEffect, useState } from 'react'
import '@/app/globals.css'
import Head from 'next/head'

const Signin = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

  return (
    <>
    <Head>
        <title>SignIn</title>
    </Head>
    <div className='bg-gray-600 w-80 relative top-[200px] left-[550px] rounded-md' >
      <div className='flex flex-col gap-4  p-4 text-center '>
        <div>
            <h1 className='font-extrabold'>SignIn</h1>
        </div>
        <div>
            <form className='' >
                <input type='text' placeholder='Username' className='h-10 rounded-md mb-2'/>
                <input type='email' placeholder='E-mail' className='h-10 rounded-md mb-2'/>
                <input type='tel' placeholder='Mobile' className='h-10 rounded-md mb-2'/>
                <input type='password' placeholder='Password' className='h-10 rounded-md'/>
            </form>
        </div>
        <div>
            <button className='bg-blue-700 hover:bg-blue-600 rounded-md w-24 h-10'>Signin</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Signin
