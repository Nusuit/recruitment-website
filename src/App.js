import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';

// Guest Pages
import HomePage from './pages/guest/HomePage';
import AboutPage from './pages/guest/AboutPage';
import JobsPage from './pages/guest/JobsPage';
import ContactPage from './pages/guest/ContactPage';
import LoginPage from './pages/guest/LoginPage';
import SignUpPage from './pages/guest/SignUpPage';
import ForgotPasswordPage from './pages/guest/ForgotPasswordPage';
import ResetPasswordPage from './pages/guest/ResetPasswordPage';
import EmailVerificationPage from './pages/guest/EmailVerificationPage';

// Applicant Pages
import ApplicantDashboard from './pages/applicant/Dashboard';
import JobSearchPage from './pages/applicant/JobSearchPage';
import JobDetailsPage from './pages/applicant/JobDetailsPage';
import SavedJobsPage from './pages/applicant/SavedJobsPage';
import ApplicationsPage from './pages/applicant/ApplicationsPage';
import ProfilePage from './pages/applicant/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import JobManagement from './pages/admin/JobManagement';
import ApplicantsManagement from './pages/admin/ApplicantsManagement';
import CompanyProfilePage from './pages/admin/CompanyProfilePage';
import ReportsPage from './pages/admin/ReportsPage';

// Layouts
import GuestLayout from './components/layouts/GuestLayout';
import ApplicantLayout from './components/layouts/ApplicantLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Auth Guards
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/applicant/dashboard" />;
  }
  return children;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return user.role === 'admin' 
      ? <Navigate to="/admin/dashboard" /> 
      : <Navigate to="/applicant/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobsProvider>
          <Routes>
            {/* Guest Routes */}
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
              <Route path="forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
              <Route path="reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
              <Route path="verify-email" element={<GuestRoute><EmailVerificationPage /></GuestRoute>} />
            </Route>
            
            {/* Applicant Routes */}
            <Route path="/applicant" element={
              <ProtectedRoute requiredRole="applicant">
                <ApplicantLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<ApplicantDashboard />} />
              <Route path="jobs" element={<JobSearchPage />} />
              <Route path="jobs/:id" element={<JobDetailsPage />} />
              <Route path="saved-jobs" element={<SavedJobsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="jobs" element={<JobManagement />} />
              <Route path="applicants" element={<ApplicantsManagement />} />
              <Route path="company-profile" element={<CompanyProfilePage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </JobsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;