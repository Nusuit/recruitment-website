import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { JobsProvider } from "./contexts/JobsContext";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles"; // Use createMuiTheme for MUI v4 with React 17
import CssBaseline from "@mui/material/CssBaseline";
import { withRouter } from "react-router-dom"; // Import withRouter

// Import SCSS files (global.scss will handle all other imports)
import "./styles/global.scss"; // Đảm bảo không có import 'postcss-loader' ở đây

// Auth Pages
import SignUpForm from "./components/auth/SignUpForm";
import LoginForm from "./components/auth/LoginForm";
import EmailVerification from "./components/auth/EmailVerification";
import ForgotPasswordPage from "./pages/guest/ForgotPasswordPage"; // Add ForgotPasswordPage
import ResetPasswordPage from "./pages/guest/ResetPasswordPage"; // Add ResetPasswordPage

// Guest Pages
import HomePage from "./pages/guest/HomePage";
import AboutPage from "./pages/guest/AboutPage";
import JobsPage from "./pages/guest/JobsPage";
import ContactPage from "./pages/guest/ContactPage";

// Applicant Pages
import ApplicantDashboard from "./pages/applicant/Dashboard";
import JobSearchPage from "./pages/applicant/JobSearchPage";
import JobDetailsPage from "./pages/applicant/JobDetailsPage";
import SavedJobsPage from "./pages/applicant/SavedJobsPage";
import ApplicationsPage from "./pages/applicant/ApplicationsPage";
import ProfilePage from "./pages/applicant/profile/ProfilePage";
import InterviewDetailsPage from "./pages/applicant/InterviewDetailsPage";
import InterviewFeedbackPage from "./pages/applicant/InterviewFeedbackPage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import JobManagement from "./pages/admin/JobManagement";
import ApplicantsManagement from "./pages/admin/ApplicantsManagement";
import CompanyProfilePage from "./pages/admin/CompanyProfilePage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage"; // Add SettingsPage
import UserManagement from "./pages/admin/users/UserManagement"; // Add UserManagement
import RoleManagement from "./pages/admin/users/RoleManagement"; // Add RoleManagement
import CreateJobPage from "./pages/admin/jobs/CreateJobPage"; // Add CreateJobPage
import AdminJobDetailsPage from "./pages/admin/jobs/JobDetailsPage"; // Admin's Job Details Page
import ApplicationDetailPage from "./pages/admin/ApplicationDetailPage"; // Admin's Application Detail Page
import JobAnalytics from "./pages/admin/analytics/JobAnalytics"; // Add JobAnalytics
import ApplicantAnalytics from "./pages/admin/analytics/ApplicantAnalytics"; // Add ApplicantAnalytics
import RecruitmentAnalytics from "./pages/admin/analytics/RecruitmentAnalytics"; // Add RecruitmentAnalytics

// Layouts
import GuestLayout from "./components/layouts/GuestLayout";
import ApplicantLayout from "./components/layouts/ApplicantLayout";
import AdminLayout from "./components/layouts/AdminLayout";

// Guards (converted to class components)
class GuestGuard extends Component {
  static contextType = AuthContext;
  render() {
    const { isAuthenticated, loading } = this.context;
    if (loading) return null; // Or a loading spinner
    return isAuthenticated ? (
      <Redirect to="/applicant/dashboard" />
    ) : (
      this.props.children
    );
  }
}

class AuthGuard extends Component {
  static contextType = AuthContext;
  render() {
    const { isAuthenticated, loading, user } = this.context;
    const { requiredRole, children } = this.props;

    if (loading) return null; // Or a loading spinner

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Redirect to="/" />; // Redirect if role doesn't match
    }

    return children;
  }
}

// OAuth2 Callback Handler Component
class OAuth2CallbackHandler extends Component {
  static contextType = AuthContext;

  async componentDidMount() {
    const { location, history } = this.props;
    const { handleGoogleOAuthCallback } = this.context;
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      const result = await handleGoogleOAuthCallback(code);
      if (result.success) {
        const role = result.user.role?.toLowerCase();
        if (role === "admin") {
          history.push("/admin/dashboard");
        } else if (role === "candidate") {
          history.push("/applicant/dashboard");
        } else {
          history.push("/");
        }
      } else {
        console.error("OAuth2 callback error:", result.error);
        history.push("/login", {
          state: { error: result.error || "Đăng nhập Google thất bại." },
        });
      }
    } else {
      history.push("/login", {
        state: { error: "Không tìm thấy mã xác thực Google." },
      });
    }
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">
          Đang xử lý đăng nhập Google...
        </div>
        {/* You can add a loading spinner here */}
      </div>
    );
  }
}

// Wrap OAuth2CallbackHandler with withRouter to get access to history/location
const WrappedOAuth2CallbackHandler = withRouter(OAuth2CallbackHandler);

// AuthLayout for login/signup pages (converted to class component for consistency)
class AuthLayout extends Component {
  render() {
    return (
      <div className="auth-layout">
        {this.props.children} {/* Render children directly */}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={createMuiTheme()}>
        {" "}
        {/* Use createMuiTheme() for MUI v4 */}
        <CssBaseline />
        <AuthProvider>
          <JobsProvider>
            <Router>
              <Switch>
                {" "}
                {/* Use Switch for React Router v5 */}
                {/* Auth Routes - No Header/Footer */}
                <Route
                  path={[
                    "/login",
                    "/signup",
                    "/verify-email",
                    "/forgot-password",
                    "/reset-password",
                    "/oauth2/callback",
                  ]}
                >
                  <AuthLayout>
                    <Switch>
                      <Route
                        path="/login"
                        render={(props) => (
                          <GuestGuard>
                            <LoginForm {...props} />
                          </GuestGuard>
                        )}
                      />
                      <Route
                        path="/signup"
                        render={(props) => (
                          <GuestGuard>
                            <SignUpForm {...props} />
                          </GuestGuard>
                        )}
                      />
                      <Route
                        path="/verify-email"
                        component={EmailVerification}
                      />
                      <Route
                        path="/forgot-password"
                        component={ForgotPasswordPage}
                      />
                      <Route
                        path="/reset-password"
                        component={ResetPasswordPage}
                      />
                      <Route
                        path="/oauth2/callback"
                        component={WrappedOAuth2CallbackHandler}
                      />
                    </Switch>
                  </AuthLayout>
                </Route>
                {/* Guest Routes - With Header/Footer */}
                <Route path={["/", "/about", "/jobs", "/jobs/:id", "/contact"]}>
                  <GuestLayout>
                    <Switch>
                      <Route exact path="/" component={HomePage} />
                      <Route path="/about" component={AboutPage} />
                      <Route exact path="/jobs" component={JobsPage} />
                      <Route path="/jobs/:id" component={JobDetailsPage} />
                      <Route path="/contact" component={ContactPage} />
                    </Switch>
                  </GuestLayout>
                </Route>
                {/* Applicant Routes */}
                <Route
                  path={[
                    "/applicant/dashboard",
                    "/applicant/jobs",
                    "/applicant/jobs/:id",
                    "/applicant/saved-jobs",
                    "/applicant/applications",
                    "/applicant/applications/:id",
                    "/applicant/applications/:id/interview",
                    "/applicant/applications/:id/feedback",
                    "/applicant/profile",
                  ]}
                >
                  <AuthGuard requiredRole="candidate">
                    {" "}
                    {/* Role is 'candidate' for applicants */}
                    <ApplicantLayout>
                      <Switch>
                        <Route
                          path="/applicant/dashboard"
                          component={ApplicantDashboard}
                        />
                        <Route
                          exact
                          path="/applicant/jobs"
                          component={JobSearchPage}
                        />
                        <Route
                          path="/applicant/jobs/:id"
                          component={JobDetailsPage}
                        />
                        <Route
                          path="/applicant/saved-jobs"
                          component={SavedJobsPage}
                        />
                        <Route
                          exact
                          path="/applicant/applications"
                          component={ApplicationsPage}
                        />
                        <Route
                          path="/applicant/applications/:id"
                          component={ApplicationDetailPage}
                        />{" "}
                        {/* This might need to be ApplicationDetailsPage */}
                        <Route
                          path="/applicant/applications/:id/interview"
                          component={InterviewDetailsPage}
                        />
                        <Route
                          path="/applicant/applications/:id/feedback"
                          component={InterviewFeedbackPage}
                        />
                        <Route
                          path="/applicant/profile"
                          component={ProfilePage}
                        />
                      </Switch>
                    </ApplicantLayout>
                  </AuthGuard>
                </Route>
                {/* Admin Routes */}
                <Route
                  path={[
                    "/admin/dashboard",
                    "/admin/jobs",
                    "/admin/jobs/create",
                    "/admin/jobs/:jobId",
                    "/admin/jobs/:jobId/edit",
                    "/admin/applicants",
                    "/admin/applications/:id",
                    "/admin/company-profile",
                    "/admin/reports",
                    "/admin/settings",
                    "/admin/users",
                    "/admin/roles",
                    "/admin/analytics/jobs",
                    "/admin/analytics/applicants",
                    "/admin/analytics/recruitment",
                  ]}
                >
                  <AuthGuard requiredRole="admin">
                    <AdminLayout>
                      <Switch>
                        <Route
                          path="/admin/dashboard"
                          component={AdminDashboard}
                        />
                        <Route
                          exact
                          path="/admin/jobs"
                          component={JobManagement}
                        />
                        <Route
                          path="/admin/jobs/create"
                          component={CreateJobPage}
                        />
                        <Route
                          exact
                          path="/admin/jobs/:jobId"
                          component={AdminJobDetailsPage}
                        />
                        <Route
                          path="/admin/jobs/:jobId/edit"
                          render={(props) => (
                            <CreateJobPage isEditing={true} {...props} />
                          )}
                        />
                        <Route
                          exact
                          path="/admin/applicants"
                          component={ApplicantsManagement}
                        />
                        <Route
                          path="/admin/applications/:id"
                          component={ApplicationDetailPage}
                        />
                        <Route
                          path="/admin/company-profile"
                          component={CompanyProfilePage}
                        />
                        <Route path="/admin/reports" component={ReportsPage} />
                        <Route
                          path="/admin/settings"
                          component={SettingsPage}
                        />
                        <Route path="/admin/users" component={UserManagement} />
                        <Route path="/admin/roles" component={RoleManagement} />
                        <Route
                          path="/admin/analytics/jobs"
                          component={JobAnalytics}
                        />
                        <Route
                          path="/admin/analytics/applicants"
                          component={ApplicantAnalytics}
                        />
                        <Route
                          path="/admin/analytics/recruitment"
                          component={RecruitmentAnalytics}
                        />
                      </Switch>
                    </AdminLayout>
                  </AuthGuard>
                </Route>
                {/* 404 Route */}
                <Route path="*">
                  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">
                      404
                    </h1>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                      Không tìm thấy trang
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Trang bạn đang tìm kiếm không tồn tại.
                    </p>
                    <Link
                      to="/"
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Về trang chủ
                    </Link>
                  </div>
                </Route>
              </Switch>
            </Router>
          </JobsProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  }
}

export default App;
