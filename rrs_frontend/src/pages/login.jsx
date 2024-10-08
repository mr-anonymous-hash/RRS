import React, { useState } from 'react'
import './../app/globals.css'
import Head from 'next/head'
import axios from 'axios';
import { useRouter } from 'next/router';
import Toast from '../components/Toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [popup, setPopup] = useState(false)
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
                setPopup(true)
                setTimeout(() => {
                    router.push('/home');
                }, 1000);
            }
        } catch (error) {
            console.error('Error', error);
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
            setPopup(true)
        }
        finally{
            setPopup(false)
        }

    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className=' flex w-full min-h-screen justify-center items-center '>
                <div className='bg-gray-200 p-5 w-auto h-auto flex flex-col gap-3 
                text-center rounded-lg '>
                    <div>
                        <h1 className='font-extrabold text-2xl text-black'>Login</h1>
                    </div>
                        <Toast
                            message={message}
                            isOpen={popup}/>
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
                            <button type="submit" className='bg-blue-700 hover:bg-blue-600
                             rounded-md h-10 w-full text-white'>Login</button>
                        </form>
                        <div className='pt-4'>
                            <p className='text-black capitalize'>don't have account ? 
                                <a href='/signup' className='text-blue-600 hover:underline'
                                 > register now</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login