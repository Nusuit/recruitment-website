// src/routes/ClientRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/client/Home';
import Jobs from '../pages/client/Jobs';
import JobDetail from '../pages/client/JobDetail';
import Application from '../pages/client/Application';
import Profile from '../pages/client/Profile';
import Notifications from '../pages/client/Notifications';
import SavedJobs from '../pages/client/SavedJobs';
import Departments from '../pages/client/Departments';
import About from '../pages/client/About';

const ClientRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/about" element={<About />} />
          <Route path="/apply/:id" element={isAuthenticated ? <Application /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/saved-jobs" element={isAuthenticated ? <SavedJobs /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default ClientRoutes;