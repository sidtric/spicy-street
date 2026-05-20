import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'));

  const login = async (password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { password });
    sessionStorage.setItem('admin_token', data.token);
    setToken(data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Attach token to all requests on load
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAdmin: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
