import React, { useState } from 'react';
import { AuthContext,} from './AuthContext';
import { setBasicAuthHeader, clearAuthHeader } from '../Services/axiosInstance';
import { setAuthToken } from '../Services/authService';


const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return username && role
      ? { username, role, isAuthenticated: true }
      : { username: null, role: null, isAuthenticated: false };
  });

  const login_storage = (username, password, role) => {
    setBasicAuthHeader(username, password);
    setAuthToken(btoa(`${username}:${password}`));
    // Update auth state
    setAuth({ username, role, isAuthenticated: true });
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    clearAuthHeader();
    setAuth({ username: null, role: null, isAuthenticated: false });
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login_storage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
