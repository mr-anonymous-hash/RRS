import React, { useState } from 'react';
import './../../app/globals.css';
import SideNav from './../../components/SideNav';
import { IoArrowBackSharp } from 'react-icons/io5';

const Settings = () => {
  const [popupType, setPopupType] = useState(null); // null, 'email', 'password'
  const [userData, setUserData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission for changing email or password
    if (popupType === 'email') {
      console.log('Updating email:', userData.email);
      // Add API call to update email
    } else if (popupType === 'password') {
      console.log('Updating password:', userData.currentPassword, userData.newPassword);
      // Add API call to update password
    }
    closeModal();
  };

  const closeModal = () => {
    setPopupType(null);
    setUserData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      email: ''
    });
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="flex-1 p-6">
        <div className="flex items-center">
          <IoArrowBackSharp size={24} className="cursor-pointer text-black" onClick={() => router.back()} />
          <h1 className="text-xl font-bold ml-4 text-black">User Settings</h1>
        </div>
        
        <div className="mt-6  flex flex-col gap-10 ">
          
          <div><button
            className="py-2 px-4 bg-blue-500 text-white rounded-md"
            onClick={() => setPopupType('email')}
          >
            Change Email
          </button></div>

          <div>
          <button
            className="py-2 px-4 bg-green-500 text-white rounded-md"
            onClick={() => setPopupType('password')}
          >
            Change Password
          </button>
          </div>
        </div>

      
        {popupType && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h2 className="text-lg font-semibold mb-4">
                {popupType === 'email' ? 'Change Email' : 'Change Password'}
              </h2>

              <form onSubmit={handleSubmit}>
                {popupType === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                )}

                {popupType === 'password' && (
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={userData.currentPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2 px-4 bg-gray-300 text-black rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
