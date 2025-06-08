// src/pages/guest/OAuth2RedirectHandler.jsx
import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleOAuthCallback, isAuthenticated, user, loading: authContextLoading } = useContext(AuthContext);
  const processedRef = useRef(false);

  useEffect(() => {
    const processOAuthCallback = async () => {
      if (processedRef.current || authContextLoading) {
        return;
      }

      try {
        processedRef.current = true;
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(error);
        }
        
        if (!token) {
          throw new Error("Token not found in URL");
        }

        const result = await handleGoogleOAuthCallback(token);
        if (!result.success) {
          throw new Error(result.error || "Authentication failed");
        }

        // Clear URL parameters after successful processing
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("[OAuth2RedirectHandler] Error:", err.message);
        navigate('/login', { 
          replace: true, 
          state: { error: err.message || "Google authentication failed" }
        });
      }
    };

    processOAuthCallback();
  }, [location.search, handleGoogleOAuthCallback, navigate, authContextLoading]);

  useEffect(() => {
    if (!authContextLoading && isAuthenticated && user) {
      const userEmail = user.email?.toLowerCase();
      const role = userEmail === "hacnguyet108@gmail.com" ? "recruiter" : user.role?.toLowerCase();
      
      let dashboardPath = '/applicant/dashboard';
      if (userEmail === 'hacnguyet108@gmail.com' || role === 'recruiter' || role === 'admin') {
        dashboardPath = '/admin/dashboard';
      }

      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, authContextLoading, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <LoadingSpinner />
      <p className="mt-4 text-lg text-gray-700 font-medium">Completing login...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
    </div>
  );
};

export default OAuth2RedirectHandler;