import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import './../app/globals.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        setError('We couldn\'t find an account with that email address.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-md">
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-center text-2xl font-bold text-slate-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={sendMail} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-700" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm 
                         placeholder:text-gray-400 text-gray-700 focus:outline-none 
                         focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white
                       shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                       disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Sending...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>

        {/* Messages */}
        <div className="px-6 pb-6">
          {message && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 mt-4">
              <p className="text-sm text-green-700">
                {message}
              </p>
            </div>
          )}
          
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-4">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-center rounded-b-lg">
          <a 
            href="/login" 
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;