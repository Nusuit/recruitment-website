// src/pages/guest/OAuth2RedirectHandler.jsx
import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleOAuthCallback, isAuthenticated, user, loading: authContextLoading } = useContext(AuthContext);
  const hasProcessedUrl = useRef(false);
  const hasAttemptedRedirect = useRef(false);

  useEffect(() => {
    console.log("[OAuth2RedirectHandler] Component rendered", {
      authContextLoading,
      isAuthenticated,
      hasProcessedUrl: hasProcessedUrl.current,
      hasAttemptedRedirect: hasAttemptedRedirect.current,
      locationSearch: location.search
    });

    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(error);
        }
        
        if (!token) {
          throw new Error("Token not found");
        }

        const result = await handleGoogleOAuthCallback(token);
        if (!result.success) {
          throw new Error(result.error || "Authentication failed");
        }

        console.log("[OAuth2RedirectHandler] OAuth successful");
        
        // Clear URL parameters after successful processing
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("[OAuth2RedirectHandler] Error:", err.message);
        navigate('/login', { 
          replace: true, 
          state: { error: err.message || "Xác thực Google thất bại" }
        });
      }
    };

    // Process OAuth callback only once
    if (!hasProcessedUrl.current && location.search && !authContextLoading) {
      hasProcessedUrl.current = true;
      console.log("[OAuth2RedirectHandler] Processing callback");
      processCallback();
    }

    // Handle authenticated state and redirect
    if (isAuthenticated && user && !hasAttemptedRedirect.current) {
      hasAttemptedRedirect.current = true;
      const userEmail = user.email?.toLowerCase();
      console.log("[OAuth2RedirectHandler] Authenticated user email:", userEmail);
      
      // Always check email first, then fallback to role
      let role = userEmail === "hacnguyet108@gmail.com" ? "recruiter" : user.role?.toLowerCase();
      let dashboardPath;

      // Check email first, then role
      if (userEmail === 'hacnguyet108@gmail.com') {
        console.log("[OAuth2RedirectHandler] Special recruiter email detected, forcing admin dashboard");
        dashboardPath = '/admin/dashboard';
      } else if (role === 'recruiter' || role === 'admin') {
        dashboardPath = '/admin/dashboard';
      } else {
        dashboardPath = '/applicant/dashboard';
      }

      console.log("[OAuth2RedirectHandler] User authenticated, navigating to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
    }
  }, [location.search, navigate, handleGoogleOAuthCallback, isAuthenticated, user, authContextLoading]);

  // Show loading state only when processing URL or auth loading
  if (authContextLoading || (location.search && !hasProcessedUrl.current)) {
    return <LoadingSpinner fullPage message="Đang xử lý đăng nhập..." />;
  }

  // Fallback loading state
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <LoadingSpinner />
      <p className="mt-4 text-lg text-gray-700 font-medium">Đang hoàn tất đăng nhập...</p>
      <p className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
    </div>
  );
};

export default OAuth2RedirectHandler;