import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import AdminDashboard from "../Pages/AdminDashboard";
import UserDashboard from "../Pages/UserDashboard";
import { Navigate } from "react-router-dom";
import Unauthorized from "../Pages/Unauthorized";
import PermitForm from "../Components/PermitForm";
export default function AppRouter() {
    const role = localStorage.getItem("role"); // Assuming you store the role in localStorage after login
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/user-dashboard"
          element={
            role === 'ROLE_USER'
              ? <UserDashboard />
              : <Unauthorized />
          }
        />
        <Route
          path="/create-permit"
          element={
            role === 'ROLE_USER'
              ? <PermitForm />
              : <Unauthorized />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            role === 'ROLE_ADMIN'
              ? <AdminDashboard />
              : <Unauthorized />
          }
        />  
        {/* You can add dashboard or admin panel later */}
      </Routes>
    </Router>
  );
}