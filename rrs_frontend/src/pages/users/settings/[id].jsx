import React, { useEffect, useState } from 'react';
import './../../../app/globals.css';
import SideNav from '../../../components/SideNav';
import { useRouter } from 'next/router';
import Toast from '../../../components/Toast';

const Settings = () => {
  const [modalType, setModalType] = useState(null);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
    phone: ''
  });
  const [userDetails, setUserDetails] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'email') {
      await changeEmail();
    } else if (modalType === 'password') {
      await changePassword();
    } else if (modalType === 'phone') {
      await changePhone();
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setUserData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      email: '',
      phone: ''
    });
  };

  const changePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/users/password/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
          confirmPassword: userData.confirmPassword
        })
      });

      if (res.ok) {
        setMessage('Password changed successfully');
        setToast(true);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || 'Unable to change password');
        setToast(true);
      }
    } catch (error) {
      setMessage('Unable to change password');
      setToast(true);
    }
  };

  const changeEmail = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/users/email/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email
        })
      });

      if (res.ok) {
        setMessage('Email changed successfully');
        setToast(true);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || 'Unable to change email');
        setToast(true);
      }
    } catch (error) {
      setMessage('Unable to change email');
      setToast(true);
    }
  };

  const changePhone = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/users/phone/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: userData.phone
        })
      });

      if (res.ok) {
        setMessage('Phone number changed successfully');
        setToast(true);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || 'Unable to change phone number');
        setToast(true);
      }
    } catch (error) {
      setMessage('Unable to change phone number');
      setToast(true);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserDetails(data);
      }
    } catch (error) {
      console.log(`Error While fetching user details ${error}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6 text-slate-800">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <img 
                src={userDetails.avatar || `https://ui-avatars.com/api/?name=${userDetails.name}`}
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-400"
              />
              <div>
                <h2 className="text-xl font-semibold">{userDetails.name}</h2>
                <p className="text-gray-600">Account Settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{userDetails.email}</p>
                </div>
                <button 
                  onClick={() => setModalType('email')}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{userDetails.phone}</p>
                </div>
                <button 
                  onClick={() => setModalType('phone')}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Password</p>
                  <p className="font-medium">••••••••</p>
                </div>
                <button 
                  onClick={() => setModalType('password')}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {modalType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl text-slate-800 font-semibold mb-4">
                {modalType === 'email' ? 'Update Email' : 
                 modalType === 'phone' ? 'Update Phone' : 
                 'Change Password'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-gray-700 ">
                {modalType === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {modalType === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                {modalType === 'password' && (
                  <>
                    <div >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={userData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={userData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Toast message={message} isOpen={toast} />
      </div>
    </div>
  );
};

export default Settings;