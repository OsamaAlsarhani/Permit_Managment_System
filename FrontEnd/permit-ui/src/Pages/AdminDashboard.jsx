import React from 'react'
import Navbar from '../Components/Navbar'
import ReportSummary from '../Components/ReportSummary' 
import AdminPermitsContainer from '../Components/AdminPermitsContainer'
const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-6">Admin Dashboard</h1>
      <p className="text-center text-gray-600">Welcome to the admin dashboard!</p>
      <ReportSummary />
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-6">User Permits</h1>
      <AdminPermitsContainer />
    </div>
  )
}

export default AdminDashboard
  