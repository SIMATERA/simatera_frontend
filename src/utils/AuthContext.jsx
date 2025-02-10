'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pastikan kita memeriksa bahwa localStorage ada dan nilai tidak "null"
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'null') {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
