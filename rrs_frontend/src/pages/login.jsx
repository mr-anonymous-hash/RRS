import React from 'react'
import '@/app/globals.css'
import Head from 'next/head'
const Login = () => {
  return (
    <>
    <Head>
        <title>Login</title>
    </Head>
    <div className='bg-gray-500 w-80 relative left-[600px] top-[200px] p-5 rounded-lg'>
      <div className='flex flex-col gap-3 text-center '>
        <div>
            <h1 className='font-extrabold '>Login</h1>
        </div>
        <div>
            <form className='' >
                <input type='email' placeholder='E-mail' className='h-10 rounded-md mb-2'/>
                <input type='password' placeholder='Password' className='h-10 rounded-md'/>
            </form>
        </div>
        <div>
            <button className='bg-blue-700 hover:bg-blue-600 rounded-md h-10 w-24'>Login</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
