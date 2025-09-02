import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TalentProfile from './pages/TalentProfile';
import GigBoard from './pages/GigBoard';

export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  // Update auth state and localStorage
  const setAuthData = (data) => {
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth({ token: data.token, user: data.user });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth({ token: null, user: null });
      navigate('/login');
    }
  };

  // Check localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setAuth({ token, user });
    }
  }, []);

  // API URL from .env
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  return (
    <AuthContext.Provider value={{ auth, setAuthData, API_URL }}>
      <Navbar />
      <main style={{ padding: '20px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<TalentProfile />} />
          <Route path="/gigs" element={<GigBoard />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
