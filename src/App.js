import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import CSS files
// 1. Base
import './styles/base/reset.css'; 
import './styles/base/variables.css';

// 2. Layout
import './styles/layouts.css';
import './styles/layouts/admin-layout.css';

// 3. Components
import './styles/components/header.css';
import './styles/components/footer.css';
import './styles/components/buttons.css';
import './styles/components/cards.css';
import './styles/components/forms.css';
import './styles/components/modals.css';
import './styles/components/alerts.css';

// 4. Pages
import './styles/pages/home-page.css';
import './styles/pages/job-search.css';
import './styles/pages/job-details.css';
import './styles/pages/auth-pages.css';

// Auth Pages
import SignUpForm from './components/auth/SignUpForm';
import LoginForm from './components/auth/LoginForm';
import EmailVerification from './components/auth/EmailVerification';

// Guest Pages
import HomePage from './pages/guest/HomePage';
import AboutPage from './pages/guest/AboutPage';
import JobsPage from './pages/guest/JobsPage';
import ContactPage from './pages/guest/ContactPage';

// Applicant Pages
import ApplicantDashboard from './pages/applicant/Dashboard';
import JobSearchPage from './pages/applicant/JobSearchPage';
import JobDetailsPage from './pages/applicant/JobDetailsPage';
import SavedJobsPage from './pages/applicant/SavedJobsPage';
import ApplicationsPage from './pages/applicant/ApplicationsPage';
import ProfilePage from './pages/applicant/profile/ProfilePage';
import InterviewDetailsPage from './pages/applicant/InterviewDetailsPage';
import InterviewFeedbackPage from './pages/applicant/InterviewFeedbackPage';

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

// 5. Utilities và animations
import './styles/utilities.css';
import './styles/animations.css';
// 6. Fixes
import './styles/fixes.css';

// Guards
const GuestGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/applicant/dashboard" />;
  }
  return children;
};

const AuthGuard = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Create AuthLayout for login/signup pages
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <JobsProvider>
          <Router>
            <Routes>
              {/* Auth Routes - No Header/Footer */}
              <Route element={<AuthLayout />}>
                <Route 
                  path="login" 
                  element={
                    <GuestGuard>
                      <LoginForm />
                    </GuestGuard>
                  } 
                />
                <Route 
                  path="signup" 
                  element={
                    <GuestGuard>
                      <SignUpForm />
                    </GuestGuard>
                  } 
                />
              <Route path="verify-email" element={<EmailVerification />} />
              </Route>

              {/* Guest Routes - With Header/Footer */}
              <Route path="/" element={<GuestLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:id" element={<JobDetailsPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Applicant Routes */}
              <Route 
                path="/applicant" 
                element={
                  <AuthGuard requiredRole="applicant">
                    <ApplicantLayout />
                  </AuthGuard>
                }
              >
                <Route path="dashboard" element={<ApplicantDashboard />} />
                <Route path="jobs" element={<JobSearchPage />} />
                <Route path="jobs/:id" element={<JobDetailsPage />} />
                <Route path="saved-jobs" element={<SavedJobsPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="applications/:id" element={<JobDetailsPage />} />
                <Route path="applications/:id/interview" element={<InterviewDetailsPage />} />
                <Route path="applications/:id/feedback" element={<InterviewFeedbackPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AuthGuard requiredRole="admin">
                    <AdminLayout />
                  </AuthGuard>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="jobs" element={<JobManagement />} />
                <Route path="applicants" element={<ApplicantsManagement />} />
                <Route path="company-profile" element={<CompanyProfilePage />} />
                <Route path="reports" element={<ReportsPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="not-found">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <Link to="/">Go Home</Link>
                </div>
              } />
            </Routes>
          </Router>
        </JobsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;