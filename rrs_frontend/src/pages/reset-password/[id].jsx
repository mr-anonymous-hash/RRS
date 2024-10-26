import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/dist/client/router';
import './../../app/globals.css'

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {id} = router.query

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && 
           hasNumbers && hasSpecialChar;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPass) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/reset-password/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, confirmPass })
      });

      if (res.ok) {
        setMessage('Password has been reset successfully. You can now login with your new password.');
        setPassword('');
        setConfirmPass('');
      } else {
        setError('Failed to reset password. Please try again or request a new reset link.');
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
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                {/* <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 text-sm 
                           placeholder:text-gray-400 text-slate-800"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <div className="relative">
                {/* <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 text-sm 
                           placeholder:text-gray-400 text-slate-800   
                            disabled:opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>At least 8 characters</li>
                <li>Upper and lowercase letters</li>
                <li>Numbers</li>
                <li>Special characters (!@#$%^&*)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPass}
              className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white
                       shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Resetting Password...
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

export default ResetPassword;