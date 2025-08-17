import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-800">Permit System</div>
      <div className="flex items-center gap-4">
        {auth.isAuthenticated ? (
          <>
            <span className="text-gray-700">
               <strong>{auth.username}</strong> <span className="text-sm text-gray-500">({auth.role.replace('ROLE_', '')})</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-gray-500">Welcome, Guest</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
