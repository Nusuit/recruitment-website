// src/App.js
import React, { useContext, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet, // Dùng cho nested routes trong layout
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { JobsProvider } from "./contexts/JobsContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom"; // Import Link

import "./styles/global.scss";

// Layouts
import GuestLayout from "./components/layouts/GuestLayout";
import ApplicantLayout from "./components/layouts/ApplicantLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import LoadingSpinner from "./components/common/LoadingSpinner"; // Import LoadingSpinner

// --- Lazy load các trang ---
// Guest Pages
const HomePage = lazy(() => import("./pages/guest/HomePage"));
const AboutPage = lazy(() => import("./pages/guest/AboutPage"));
const GuestJobsPage = lazy(() => import("./pages/guest/JobsPage")); // Đổi tên để tránh trùng
const ContactPage = lazy(() => import("./pages/guest/ContactPage"));
const CheckEmailPage = lazy(() => import("./pages/guest/CheckEmailPage"));

// Auth Pages
const SignUpForm = lazy(() => import("./components/auth/SignUpForm"));
const LoginForm = lazy(() => import("./components/auth/LoginForm"));

const EmailVerificationPage = lazy(() =>
  import("./pages/guest/EmailVerificationPage")
); // Sử dụng Page
const ForgotPasswordPage = lazy(() =>
  import("./pages/guest/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("./pages/guest/ResetPasswordPage"));

const LoginPage = lazy(() => import("./pages/guest/LoginPage"));
const SignUpPage = lazy(() => import("./pages/guest/SignUpPage"));

// Applicant Pages
const ApplicantDashboard = lazy(() => import("./pages/applicant/Dashboard"));
const ApplicantJobSearchPage = lazy(() =>
  import("./pages/applicant/JobSearchPage")
); // Đổi tên
const ApplicantJobDetailsPage = lazy(() =>
  import("./pages/applicant/JobDetailsPage")
); // Đổi tên
const SavedJobsPage = lazy(() => import("./pages/applicant/SavedJobsPage"));
const ApplicationsPage = lazy(() =>
  import("./pages/applicant/ApplicationsPage")
);
const ApplicantApplicationDetailsPage = lazy(() =>
  import("./pages/applicant/ApplicationDetailsPage")
); // Đổi tên
const ProfilePage = lazy(() => import("./pages/applicant/profile/ProfilePage"));
const InterviewDetailsPage = lazy(() =>
  import("./pages/applicant/InterviewDetailsPage")
);
const InterviewFeedbackPage = lazy(() =>
  import("./pages/applicant/InterviewFeedbackPage")
);
const JobApplyPage = lazy(() => import("./pages/applicant/JobApplyPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const JobManagement = lazy(() => import("./pages/admin/JobManagement"));
const ApplicantsManagement = lazy(() =>
  import("./pages/admin/ApplicantsManagement")
);
const CompanyProfilePage = lazy(() =>
  import("./pages/admin/CompanyProfilePage")
);
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UserManagement = lazy(() => import("./pages/admin/users/UserManagement"));
const RoleManagement = lazy(() => import("./pages/admin/users/RoleManagement"));
const CreateJobPage = lazy(() => import("./pages/admin/jobs/CreateJobPage"));
const AdminJobDetailsPage = lazy(() =>
  import("./pages/admin/jobs/JobDetailsPage")
);
const AdminApplicationDetailPage = lazy(() =>
  import("./pages/admin/ApplicationDetailPage")
); // Đổi tên
const JobAnalytics = lazy(() => import("./pages/admin/analytics/JobAnalytics"));
const ApplicantAnalytics = lazy(() =>
  import("./pages/admin/analytics/ApplicantAnalytics")
);
const RecruitmentAnalytics = lazy(() =>
  import("./pages/admin/analytics/RecruitmentAnalytics")
);
const AdminProfilePage = lazy(() => import("./pages/admin/ProfilePage"));


// --- Guards ---
const GuestGuard = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  if (loading) return <LoadingSpinner fullPage />;
  if (isAuthenticated) {
    const role = user?.role?.toLowerCase();
    if (role === "admin" || role === "recruiter") return <Navigate to="/admin/dashboard" replace />; // Cả admin và recruiter đều về admin dashboard
    if (role === "candidate")
      return <Navigate to="/applicant/dashboard" replace />;
    return <Navigate to="/" replace />; // Fallback nếu có role lạ
  }
  return children;
};

const AuthGuard = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase();
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole.map(r => r.toLowerCase()) : [requiredRole.toLowerCase()];
    if (!allowedRoles.includes(userRole)) {
      if (userRole === "candidate") {
        return <Navigate to="/applicant/dashboard" replace />;
      }
      return <Navigate to="/admin/dashboard" replace />; // Điều hướng về dashboard admin
    }
  }
  
  return children;
};

// --- OAuth2 Callback Handler ---
// Component này sẽ được kích hoạt khi backend chuyển hướng đến /api/oauth2/login/google
// Nó sẽ đọc accessToken từ URL, lưu vào localStorage, và sau đó điều hướng
const OAuth2CallbackHandler = () => {
  const { checkAuthStatus, loading: authLoading, isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[OAuth2CallbackHandler] Component mounted/updated. Current URL search params:", location.search);

    // Nếu đã xác thực và có thông tin người dùng, điều hướng ngay lập tức
    if (isAuthenticated && user && user.role) {
      const userRole = user.role?.toLowerCase();
      let dashboardPath;
      if (userRole === "recruiter" || userRole === "admin") {
        dashboardPath = "/admin/dashboard";
      } else if (userRole === "applicant") {
        dashboardPath = "/applicant/dashboard";
      } else {
        dashboardPath = "/";
      }
      console.log("[OAuth2CallbackHandler] Already authenticated, navigating to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      // Đảm bảo URL được làm sạch ngay cả khi đã xác thực và điều hướng lại
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const processTokensAndRedirect = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('accessToken');
      const error = params.get('error'); // Xử lý lỗi nếu có từ backend

      console.log("[OAuth2CallbackHandler] Parsed URL params - accessToken:", accessToken ? "present" : "absent", "error:", error);

      if (error) {
        console.error("[OAuth2CallbackHandler] OAuth2 callback error from backend:", error);
        navigate("/login", {
          replace: true,
          state: { error: `Đăng nhập Google thất bại: ${error}` },
        });
        // LUÔN LUÔN xóa các tham số token khỏi URL sau khi đã xử lý lỗi
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (accessToken) {
        console.log("[OAuth2CallbackHandler] AccessToken found in URL. Storing.");
        localStorage.setItem('token', accessToken); // Lưu accessToken vào localStorage
        // Refresh token không cần lưu ở đây vì backend đặt vào cookie HTTP-only

        // Kích hoạt AuthContext để đọc token mới và fetch user profile
        console.log("[OAuth2CallbackHandler] Triggering auth status check.");
        const authCheckResult = await checkAuthStatus(); // Chờ checkAuthStatus hoàn tất
        console.log("[OAuth2CallbackHandler] Auth status check result:", authCheckResult);

        // Sau khi checkAuthStatus hoàn tất và user đã được cập nhật trong context
        // Điều hướng rõ ràng đến trang đích mong muốn
        if (authCheckResult?.success && authCheckResult?.user) {
          const userRole = authCheckResult.user.role?.toLowerCase();
          let dashboardPath;
          if (userRole === "recruiter" || userRole === "admin") {
            dashboardPath = "/admin/dashboard";
          } else if (userRole === "applicant") {
            dashboardPath = "/applicant/dashboard";
          } else {
            dashboardPath = "/";
          }
          console.log("[OAuth2CallbackHandler] OAuth login successful, navigating to:", dashboardPath);
          navigate(dashboardPath, { replace: true });
        } else {
          console.error("[OAuth2CallbackHandler] Failed to get user profile after OAuth. Redirecting to login.");
          navigate("/login", {
            replace: true,
            state: { error: authCheckResult?.error || "Không thể lấy thông tin người dùng sau đăng nhập Google." },
          });
        }

        // LUÔN LUÔN xóa các tham số token khỏi URL sau khi đã xử lý, bất kể điều hướng thành công hay không
        // Đặt ở cuối cùng để đảm bảo logic xử lý đã chạy
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log("[OAuth2CallbackHandler] URL cleaned.");

      } else {
        console.warn("[OAuth2CallbackHandler] No accessToken found in URL. Redirecting to login.");
        navigate("/login", {
          replace: true,
          state: { error: "Không tìm thấy token xác thực sau đăng nhập Google." },
        });
        // LUÔN LUÔN xóa các tham số token khỏi URL nếu không tìm thấy
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // Chỉ xử lý token nếu không đang tải và chưa xác thực
    // hoặc nếu đang ở trang callback và có query params (để xử lý refresh)
    if (!authLoading && !isAuthenticated && location.search) {
      processTokensAndRedirect();
    } else if (!authLoading && isAuthenticated) {
      // Nếu đã xác thực nhưng vẫn ở trang callback (có thể do refresh), điều hướng lại
      const userRole = user?.role?.toLowerCase();
      let dashboardPath;
      if (userRole === "recruiter" || userRole === "admin") {
        dashboardPath = "/admin/dashboard";
      } else if (userRole === "applicant") {
        dashboardPath = "/applicant/dashboard";
      } else {
        dashboardPath = "/";
      }
      console.log("[OAuth2CallbackHandler] Already authenticated, redirecting to dashboard:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      // Đảm bảo URL được làm sạch ngay cả khi đã xác thực và điều hướng lại
      window.history.replaceState({}, document.title, window.location.pathname);
    }

  }, [location.search, navigate, checkAuthStatus, authLoading, isAuthenticated, user]);

  if (authLoading) {
    return <LoadingSpinner fullPage message="Đang xử lý đăng nhập Google..." />;
  }

  return <LoadingSpinner fullPage message="Đang hoàn tất đăng nhập..." />;
};

// --- Auth Layout (cho các trang login, signup, etc.) ---
const AuthLayoutWrapper = () => {
  return (
    <div className="auth-layout min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet /> {/* Các trang con của AuthLayout sẽ được render ở đây */}
    </div>
  );
};

// --- Not Found Page ---
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

// --- Main App Component ---
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
      <AuthProvider>
        <JobsProvider>
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
                  {/* SỬA ĐỔI QUAN TRỌNG: Cập nhật path cho OAuth2 callback */}
                  {/* Route này sẽ xử lý khi backend chuyển hướng với token trong URL */}
                  <Route
                    path="/api/oauth2/login/google" // Đường dẫn mới theo cấu hình backend
                    element={<OAuth2CallbackHandler />}
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

                {/* Admin/Recruiter Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <AuthGuard requiredRole={["admin", "recruiter"]}>
                      <AdminLayout>
                        <Routes>
                          <Route
                            path="dashboard"
                            element={<AdminDashboard />}
                          />
                          <Route path="jobs" element={<JobManagement />} />
                          <Route
                            path="jobs/create"
                            element={<CreateJobPage />}
                          />
                          <Route
                            path="jobs/:jobId/edit"
                            element={<CreateJobPage isEditing />}
                          />
                          <Route
                            path="jobs/:jobId"
                            element={<AdminJobDetailsPage />}
                          />
                          <Route
                            path="applicants"
                            element={<ApplicantsManagement />}
                          />
                          <Route
                            path="applications/:id"
                            element={<AdminApplicationDetailPage />}
                          />
                          <Route
                            path="company-profile"
                            element={<CompanyProfilePage />}
                          />
                          <Route path="reports" element={<ReportsPage />} />
                          <Route path="settings" element={<SettingsPage />} />
                          <Route path="users" element={<UserManagement />} />
                          <Route path="roles" element={<RoleManagement />} />
                          <Route
                            path="profile"
                            element={<AdminProfilePage />}
                          />
                          <Route
                            path="analytics/jobs"
                            element={<JobAnalytics />}
                          />
                          <Route
                            path="analytics/applicants"
                            element={<ApplicantAnalytics />}
                          />
                          <Route
                            path="analytics/recruitment"
                            element={<RecruitmentAnalytics />}
                          />
                          <Route
                            index
                            element={<Navigate to="dashboard" replace />}
                          />
                        </Routes>
                      </AdminLayout>
                    </AuthGuard>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
        </JobsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;