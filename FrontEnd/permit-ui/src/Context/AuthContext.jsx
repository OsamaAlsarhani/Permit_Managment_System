// src/context/AuthContext.js
import { createContext } from 'react';

export const AuthContext = createContext({
  auth: { username: null, role: null, isAuthenticated: false },
  login_storage: (username, password, role) => {},
  logout: () => {},
});
