import React, { useState } from 'react'
import './../app/globals.css'
import Head from 'next/head'
import Toast from '../components/Toast'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [message, setMessage] = useState('')
    const [popup, setPopup] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        try {
            const res = await fetch('http://localhost:8000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, password, role }),
            })
            
            if (res.ok) {
                setMessage('Signup successful!')
                setPopup(true)
                setName('')
                setEmail('')
                setPhone('')
                setPassword('')
                setRole('User')
            } else {
                const data = await res.json()
                setMessage(data.message || 'Signup failed. Please try again.')
                setPopup(true)
            }
        } catch (error) {
            console.error('Error', error)
            setMessage('An error occurred. Please try again later.')
            setPopup(true)
        }
    }

    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>
            <div className='flex w-full min-h-screen justify-center items-center'>
                <div className='bg-gray-200 flex flex-col gap-4 p-4 text-center rounded-lg'>
                    <div>
                        <h1 className='font-extrabold text-2xl text-black'>Sign Up</h1>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                        <input 
                            type='text' 
                            placeholder='Username'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='h-10 rounded-md text-black px-2'
                            required
                        />
                        <input 
                            type='email'
                            placeholder='E-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='h-10 rounded-md text-black px-2'
                            required
                        />
                        <input 
                            type='tel'
                            placeholder='Phone' 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='h-10 rounded-md text-black px-2'
                            required
                        />
                        <input 
                            type='password' 
                            placeholder='Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='h-10 rounded-md text-black px-2'
                            required
                        />
                        <select 
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className='h-10 rounded-md text-black px-2'
                            required
                        >
                            <option >--select role--</option>
                            <option value="false">User</option>
                            <option value="true">Admin</option>
                        </select>
                        <button type="submit" className='bg-blue-700 hover:bg-blue-600 rounded-md w-full h-10 text-white mt-2'>
                            Sign Up
                        </button>
                    </form>
                    <div className='text-black'>
                        <p className='capitalize'>Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a></p>
                    </div>
                </div>
            </div>
            <Toast
            message={message}
            isOpen={popup}/>
        </>
    )
}

export default Signup