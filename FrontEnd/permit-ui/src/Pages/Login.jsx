import React from 'react'
import { useState,useContext } from 'react';

import { getUser } from '../Services/authService';
import { AuthContext } from '../Context/AuthContext';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login_storage } = useContext(AuthContext);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userData = await getUser(username, password); // getUser already returns data
    setSuccessMessage('✅ Login successful!');
    setErrorMessage('');
    // Saving user data to localStorage
    login_storage(username, password, userData.role); // Assuming login is a function from AuthProvider

    if (userData.role === 'ROLE_ADMIN') {
      window.location.href = '/admin-dashboard';
    } else {
      window.location.href = '/user-dashboard';
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setErrorMessage('❌ Invalid username or password');
    } else {
      setErrorMessage('Server error');
    }
    setSuccessMessage('');
  }
};


return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Login
      </h2>

      <input
        type="text"
        placeholder="Username"
        className="w-full px-4 py-2 mb-4 border rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 mb-4 border rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:cursor-pointer"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don’t have an account?{' '}
        <span
          onClick={() => (window.location.href = '/register')}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Register
        </span>
      </p>
                {successMessage && (
  <div className="mb-4 mt-4 p-2 text-green-700 bg-green-100 border border-green-300 rounded text-center">
    {successMessage}
  </div>
)}
{errorMessage && (
  <div className="mb-4 mt-4 p-2 text-red-700 bg-red-100 border border-red-300 rounded text-center">
    {errorMessage}
  </div>
)}
    </form>
  </div>
);

}


