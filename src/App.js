// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import ClientRoutes from './routes/ClientRoutes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/'} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Client Routes */}
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;