 // src/routes/AdminRoutes.js
 import React from 'react';
 import { Routes, Route, Navigate } from 'react-router-dom';
 import { useAuth } from '../hooks/useAuth';
 import AdminLayout from '../components/layout/AdminLayout';
 import Dashboard from '../pages/admin/Dashboard';
 import JobManagement from '../pages/admin/JobManagement';
 import CandidateManagement from '../pages/admin/CandidateManagement';
 import InterviewSchedule from '../pages/admin/InterviewSchedule';
 import Reports from '../pages/admin/Reports';
 import Settings from '../pages/admin/Settings';
 
 const AdminRoutes = () => {
   const { isAuthenticated, user } = useAuth();
 
   if (!isAuthenticated || user?.role !== 'admin') {
     return <Navigate to="/login" />;
   }
 
   return (
     <AdminLayout>
       <Routes>
         <Route path="dashboard" element={<Dashboard />} />
         <Route path="jobs" element={<JobManagement />} />
         <Route path="candidates" element={<CandidateManagement />} />
         <Route path="interviews" element={<InterviewSchedule />} />
         <Route path="reports" element={<Reports />} />
         <Route path="settings" element={<Settings />} />
         <Route path="*" element={<Navigate to="/admin/dashboard" />} />
       </Routes>
     </AdminLayout>
   );
 };
 
 export default AdminRoutes;