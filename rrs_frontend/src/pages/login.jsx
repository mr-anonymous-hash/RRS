import React, { useState } from 'react'
import './../app/globals.css'
import Head from 'next/head'
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted');
        setMessage('');

        try {
            const res = await axios.post('http://localhost:8000/api/login  ', {
                email: email,
                password: password
            });

            if (res.status === 200) {
                const { user, token } = res.data;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                setMessage('Login successful');
                setTimeout(() => {
                    router.push('/home');
                }, 1500);
            }
        } catch (error) {
            console.error('Error', error);
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        }
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className='bg-gray-200 w-80 relative left-[600px] top-[200px] p-5 rounded-lg'>
                <div className='flex flex-col gap-3 text-center'>
                    <div>
                        <h1 className='font-extrabold text-2xl text-black'>Login</h1>
                    </div>
                    {message && <div className={`text-sm 
                    ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}</div>}
                    <div>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                            <input
                                type='email'
                                placeholder='E-mail'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='h-10 rounded-md mb-2 px-2 text-black'
                                required
                            />
                            <input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='h-10 rounded-md px-2 text-black'
                                required
                            />
                            <button type="submit" className='bg-blue-700 hover:bg-blue-600 rounded-md h-10 w-full text-white'>Login</button>
                        </form>
                        <div>
                            <p className='text-black'>don't have account ? <a href='/signup'>register now</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login