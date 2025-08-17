import React from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom';
import PermitForm from '../Components/PermitForm';
import PermitTable from '../Components/PermitTable';
import UserPermitsContainer from '../Components/UserPermitsContainer';
const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-4">User Dashboard</h1>
      <p className="text-center text-gray-600">Welcome to the user dashboard!</p>
      <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create New Permit</h2>
        
          <button type="button"
          onClick={() => navigate('/create-permit')} className="hover:bg-blue-600 w-full bg-blue-500 text-white py-2 rounded-md hover:cursor-pointer">Create Permit</button>


      </div>

      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-6">Your Permits</h1>
      <UserPermitsContainer />
    </div>
  )
}

export default UserDashboard
