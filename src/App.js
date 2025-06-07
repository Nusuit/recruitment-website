// src/App.js
import React, { useEffect, Suspense, lazy, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
// XÓA DÒNG NÀY: import { AuthProvider, AuthContext } from "./contexts/AuthContext";
// XÓA DÒNG NÀY: import { JobsProvider } from "./contexts/JobsContext";
// Chỉ cần import AuthContext nếu các Guards dùng useContext(AuthContext)
import { AuthContext } from "./contexts/AuthContext"; // Giữ lại nếu các Guards dùng AuthContext
// Giữ lại import OAuth2RedirectHandler như đã sửa
import OAuth2RedirectHandler from './pages/guest/OAuth2RedirectHandler';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import "./styles/global.scss";

// Layouts
import GuestLayout from "./components/layouts/GuestLayout";
import ApplicantLayout from "./components/layouts/ApplicantLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load các trang
const HomePage = lazy(() => import("./pages/guest/HomePage"));
const AboutPage = lazy(() => import("./pages/guest/AboutPage"));
const GuestJobsPage = lazy(() => import("./pages/guest/JobsPage"));
const ContactPage = lazy(() => import("./pages/guest/ContactPage"));
const CheckEmailPage = lazy(() => import("./pages/guest/CheckEmailPage"));

// Auth Pages
const SignUpForm = lazy(() => import("./components/auth/SignUpForm"));
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const EmailVerificationPage = lazy(() => import("./pages/guest/EmailVerificationPage"));
const ForgotPasswordPage = lazy(() => import("./pages/guest/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/guest/ResetPasswordPage"));
const LoginPage = lazy(() => import("./pages/guest/LoginPage"));
const SignUpPage = lazy(() => import("./pages/guest/SignUpPage"));

// Applicant Pages
const ApplicantDashboard = lazy(() => import("./pages/applicant/Dashboard"));
const ApplicantJobSearchPage = lazy(() => import("./pages/applicant/JobSearchPage"));
const ApplicantJobDetailsPage = lazy(() => import("./pages/applicant/JobDetailsPage"));
const SavedJobsPage = lazy(() => import("./pages/applicant/SavedJobsPage"));
const ApplicationsPage = lazy(() => import("./pages/applicant/ApplicationsPage"));
const ApplicantApplicationDetailsPage = lazy(() => import("./pages/applicant/ApplicationDetailsPage"));
const ProfilePage = lazy(() => import("./pages/applicant/profile/ProfilePage"));
const InterviewDetailsPage = lazy(() => import("./pages/applicant/InterviewDetailsPage"));
const InterviewFeedbackPage = lazy(() => import("./pages/applicant/InterviewFeedbackPage"));
const JobApplyPage = lazy(() => import("./pages/applicant/JobApplyPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const JobManagement = lazy(() => import("./pages/admin/JobManagement"));
const ApplicantsManagement = lazy(() => import("./pages/admin/ApplicantsManagement"));
const CompanyProfilePage = lazy(() => import("./pages/admin/CompanyProfilePage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UserManagement = lazy(() => import("./pages/admin/users/UserManagement"));
const RoleManagement = lazy(() => import("./pages/admin/users/RoleManagement"));
const CreateJobPage = lazy(() => import("./pages/admin/jobs/CreateJobPage"));
const AdminJobDetailsPage = lazy(() => import("./pages/admin/jobs/JobDetailsPage"));
const AdminApplicationDetailPage = lazy(() => import("./pages/admin/ApplicationDetailPage"));
const JobAnalytics = lazy(() => import("./pages/admin/analytics/JobAnalytics"));
const ApplicantAnalytics = lazy(() => import("./pages/admin/analytics/ApplicantAnalytics"));
const RecruitmentAnalytics = lazy(() => import("./pages/admin/analytics/RecruitmentAnalytics"));
const AdminProfilePage = lazy(() => import("./pages/admin/ProfilePage"));
const EditJobPage = lazy(() => import("./pages/admin/jobs/EditJobPage"));

// Guards (giữ nguyên logic)
const GuestGuard = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  
  if (loading) return <LoadingSpinner fullPage />;
  
  if (isAuthenticated && user) {
    const role = user.role?.toLowerCase();
    const email = user.email?.toLowerCase();
    
    // Special case for the recruiter account
    if (email === "hacnguyet108@gmail.com") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    // Regular role-based routing
    if (role === "admin" || role === "recruiter") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (role === "candidate") {
      return <Navigate to="/applicant/dashboard" replace />;
    }
    
    // Fallback for authenticated users with unknown roles
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AuthGuard = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role?.toLowerCase();
  const userEmail = user.email?.toLowerCase();

  // Handle special recruiter account
  if (userEmail === "hacnguyet108@gmail.com") {
    // Only allow access to admin/recruiter pages
    if (!requiredRole || 
        (Array.isArray(requiredRole) && requiredRole.map(r => r.toLowerCase()).includes("recruiter")) ||
        requiredRole.toLowerCase() === "recruiter") {
      return children;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Regular role-based access control
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? 
      requiredRole.map(r => r.toLowerCase()) : 
      [requiredRole.toLowerCase()];

    if (!allowedRoles.includes(userRole)) {
      // Redirect based on user's role
      if (userRole === "candidate") {
        return <Navigate to="/applicant/dashboard" replace />;
      }
      if (userRole === "recruiter" || userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Default fallback
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// XÓA HOÀN TOÀN ĐỊNH NGHĨA COMPONENT OAuth2CallbackHandler NÀY KHỎI ĐÂY


// Auth Layout (cho các trang login, signup, etc.)
const AuthLayoutWrapper = () => {
  return (
    <div className="auth-layout min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
};

// Not Found Page
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
    <FontAwesomeIcon
      icon="triangle-exclamation"
      className="text-6xl text-yellow-500 mb-6"
    />
    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
      Không tìm thấy trang
    </h2>
    <p className="text-md md:text-lg text-gray-600 mb-8 max-w-md">
      Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
    >
      <FontAwesomeIcon icon="home" className="mr-2" />
      Về trang chủ
    </Link>
  </div>
);

// Main App Component
function App() {
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: "#00BFA6",
      },
      secondary: {
        main: "#6c757d",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {/* AuthProvider và JobsProvider ĐÃ ĐƯỢC CHUYỂN LÊN index.js */}
      {/* Xóa <AuthProvider> và <JobsProvider> ở đây */}
      <Router>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayoutWrapper />}>
              <Route
                path="/login"
                element={
                  <GuestGuard>
                    <LoginPage />
                  </GuestGuard>
                }
              />
              <Route
                path="/signup"
                element={
                  <GuestGuard>
                    <SignUpPage />
                  </GuestGuard>
                }
              />
              <Route
                path="/verify-email"
                element={<EmailVerificationPage />}
              />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
              />
              <Route
                path="/reset-password"
                element={<ResetPasswordPage />}
              />
              {/* SỬ DỤNG DUY NHẤT OAuth2RedirectHandler được import */}
              <Route
                path="/api/oauth2/login/google" // Backend vẫn chuyển hướng tới đây
                element={<OAuth2RedirectHandler />} // Đây là component từ file riêng
              />
              <Route
                path="/oauth2/redirect-handler" // Điểm đến từ trang HTML callback của backend
                element={<OAuth2RedirectHandler />} // Vẫn là cùng component từ file riêng
              />
            </Route>

            {/* Guest Routes */}
            <Route element={<GuestLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/jobs/create" element={<CreateJobPage />} />
              <Route path="/jobs/:id" element={<ApplicantJobDetailsPage />} />
              <Route path="/jobs" element={<GuestJobsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/check-email" element={<CheckEmailPage />} />
            </Route>

            {/* Applicant Routes */}
            <Route
              path="/applicant/*"
              element={
                <AuthGuard requiredRole="candidate">
                  <ApplicantLayout>
                    <Routes>
                      <Route
                        path="dashboard"
                        element={<ApplicantDashboard />}
                      />
                      <Route
                        path="jobs"
                        element={<ApplicantJobSearchPage />}
                      />
                      <Route
                        path="jobs/:id"
                        element={<ApplicantJobDetailsPage />}
                      />
                      <Route
                        path="jobs/:jobId/apply"
                        element={<JobApplyPage />}
                      />
                      <Route
                        path="saved-jobs"
                        element={<SavedJobsPage />}
                      />
                      <Route
                        path="applications"
                        element={<ApplicationsPage />}
                      />
                      <Route
                        path="applications/:id"
                        element={<ApplicantApplicationDetailsPage />}
                      />
                      <Route
                        path="applications/:applicationId/interview"
                        element={<InterviewDetailsPage />}
                      />
                      <Route
                        path="applications/:applicationId/feedback"
                        element={<InterviewFeedbackPage />}
                      />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                      />
                    </Routes>
                  </ApplicantLayout>
                </AuthGuard>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AuthGuard requiredRole={["admin", "recruiter"]}>
                  <AdminLayout />
                </AuthGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="jobs/create" element={<CreateJobPage />} />
              <Route path="jobs/:jobId" element={<AdminJobDetailsPage />} />
              <Route path="jobs" element={<JobManagement />} />
              <Route path="jobs/:jobId/edit" element={<EditJobPage />} />
              <Route
                path="jobs/:jobId/applicants"
                element={<AdminApplicationDetailPage />}
              />
              <Route path="applicants" element={<ApplicantsManagement />} />
              <Route path="applicants/:id" element={<AdminApplicationDetailPage />} />
              <Route path="company-profile" element={<CompanyProfilePage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              
              {/* Analytics Routes */}
              <Route path="analytics">
                <Route path="jobs" element={<JobAnalytics />} />
                <Route path="applicants" element={<ApplicantAnalytics />} />
                <Route path="recruitment" element={<RecruitmentAnalytics />} />
              </Route>

              {/* Admin-only Routes */}
              <Route
                path="reports"
                element={
                  <AuthGuard requiredRole="admin">
                    <ReportsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="settings"
                element={
                  <AuthGuard requiredRole="admin">
                    <SettingsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="users"
                element={
                  <AuthGuard requiredRole="admin">
                    <UserManagement />
                  </AuthGuard>
                }
              />
              <Route
                path="roles"
                element={
                  <AuthGuard requiredRole="admin">
                    <RoleManagement />
                  </AuthGuard>
                }
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
      {/* Xóa <JobsProvider> và <AuthProvider> ở đây */}
    </ThemeProvider>
  );
}

export default App;