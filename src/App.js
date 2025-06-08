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
const GuestJobDetailsPage = lazy(() => import("./pages/guest/GuestJobDetailsPage"));
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
const InterviewManagement = lazy(() => import("./pages/admin/applicants/InterviewManagement"));
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

// Analytics Overview - Create inline component since we can't create new files
const AnalyticsOverview = () => {
  const analyticsCards = [
    {
      title: "Job Analytics",
      description: "Track job posting performance, department trends, and hiring metrics.",
      icon: "briefcase",
      link: "/admin/analytics/jobs",
      metrics: [
        { label: "Active Jobs", value: "32" },
        { label: "Avg Time to Fill", value: "28 days" },
        { label: "Success Rate", value: "65%" },
      ],
    },
    {
      title: "Applicant Analytics", 
      description: "Monitor applicant trends, sources, and qualification rates.",
      icon: "users",
      link: "/admin/analytics/applicants",
      metrics: [
        { label: "Total Applicants", value: "1,250" },
        { label: "Application Rate", value: "12%" },
        { label: "Qualified Rate", value: "45%" },
      ],
    },
    {
      title: "Recruitment Process",
      description: "Analyze recruitment funnel, interview success, and process efficiency.",
      icon: "chart-line", 
      link: "/admin/analytics/recruitment",
      metrics: [
        { label: "Time to Hire", value: "28 days" },
        { label: "Interview Success", value: "60%" },
        { label: "Offer Acceptance", value: "85%" },
      ],
    },
  ];

  return (
    <div className="analytics-overview-page p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive insights into your recruitment performance and metrics.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Jobs</p>
            <FontAwesomeIcon icon="briefcase" className="text-2xl text-blue-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">32</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +5% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Active Applicants</p>
            <FontAwesomeIcon icon="users" className="text-2xl text-green-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">1,250</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +15% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Avg. Time to Hire</p>
            <FontAwesomeIcon icon="clock" className="text-2xl text-purple-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">28</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-down" className="mr-1" />
            -5% faster than last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500 uppercase">Success Rate</p>
            <FontAwesomeIcon icon="check-circle" className="text-2xl text-indigo-400 opacity-80" />
          </div>
          <p className="text-3xl font-bold text-gray-800">65%</p>
          <p className="text-xs font-medium mt-1 flex items-center text-green-600">
            <FontAwesomeIcon icon="arrow-up" className="mr-1" />
            +3% from last month
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {analyticsCards.map((card, index) => (
          <div key={index} className="bg-white border rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FontAwesomeIcon icon={card.icon} className="text-3xl text-blue-600" />
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Analytics
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{card.description}</p>

              <div className="space-y-2 mb-6">
                {card.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{metric.label}:</span>
                    <span className="font-semibold text-gray-800">{metric.value}</span>
                  </div>
                ))}
              </div>

              <Link
                to={card.link}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <FontAwesomeIcon icon="chart-bar" className="mr-2" />
                View Detailed Analytics
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Insights */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Insights & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="lightbulb" className="text-blue-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  AI Team Leading in Applications
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  AI Team positions are attracting 40% more applications than other departments.
                </p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  High Impact
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon icon="thumbs-up" className="text-green-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Improved Interview Success Rate
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Technical assessments showing 70% pass rate, up from last quarter.
                </p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Positive Trend
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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
    if (role === "applicant") {
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
      if (userRole === "applicant") {
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
      Page Not Found
    </h2>
    <p className="text-md md:text-lg text-gray-600 mb-8 max-w-md">
      Sorry, the page you are looking for does not exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
    >
      <FontAwesomeIcon icon="home" className="mr-2" />
      Back to Home
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
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/jobs" element={<GuestJobsPage />} />
              <Route path="/jobs/:jobId" element={<GuestJobDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/check-email" element={<CheckEmailPage />} />
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
              <Route index element={<Navigate to="/applicant/dashboard" replace />} />
              <Route path="dashboard" element={<ApplicantDashboard />} />
              <Route path="jobs" element={<ApplicantJobSearchPage />} />
              <Route path="jobs/:id" element={<ApplicantJobDetailsPage />} />
              <Route path="jobs/:jobId/apply" element={<JobApplyPage />} />
              <Route path="saved-jobs" element={<SavedJobsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/:id" element={<ApplicantApplicationDetailsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="interviews/:id" element={<InterviewDetailsPage />} />
              <Route path="interviews/:id/feedback" element={<InterviewFeedbackPage />} />
            </Route>

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
              <Route path="jobs" element={<JobManagement />} />
              <Route path="jobs/create" element={<CreateJobPage />} />
              <Route path="jobs/:jobId" element={<AdminJobDetailsPage />} />
              <Route path="jobs/:jobId/edit" element={<EditJobPage />} />
              <Route path="applicants" element={<ApplicantsManagement />} />
              <Route path="interviews" element={<InterviewManagement />} />
              <Route path="applications/:applicationId" element={<AdminApplicationDetailPage />} />
              <Route path="company-profile" element={<CompanyProfilePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="analytics" element={<AnalyticsOverview />} />
              <Route path="analytics/jobs" element={<JobAnalytics />} />
              <Route path="analytics/applicants" element={<ApplicantAnalytics />} />
              <Route path="analytics/recruitment" element={<RecruitmentAnalytics />} />
              <Route path="profile" element={<AdminProfilePage />} />
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