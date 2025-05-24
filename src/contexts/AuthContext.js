// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import authAPI from "../api/auth"; // Đảm bảo đường dẫn này đúng

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm kiểm tra trạng thái xác thực
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // TODO: Trong ứng dụng thực tế, bạn nên xác thực token với backend ở đây.
        // Ví dụ: gọi một API endpoint như /auth/me để lấy thông tin người dùng hiện tại.
        // Nếu token hợp lệ, backend sẽ trả về thông tin user.
        // Nếu không, xóa token và user khỏi localStorage.
        // const profileResponse = await authAPI.getCurrentUserProfile(); // Giả sử có API này
        // if (profileResponse.success) {
        //   setUser(profileResponse.user);
        //   setIsAuthenticated(true);
        // } else {
        //   localStorage.removeItem("token");
        //   localStorage.removeItem("user");
        //   setUser(null);
        //   setIsAuthenticated(false);
        // }
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra xác thực:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      // console.log("AuthContext loaded, loading:", false, "isAuthenticated:", isAuthenticated, "user:", user);
    }
  }, []); // Bỏ isAuthenticated và user khỏi dependency array để tránh loop

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authAPI.login(email, password);
      if (result.success && result.user) {
        // authAPI.login đã lưu token và user vào localStorage
        setUser(result.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: result.user };
      } else {
        setLoading(false);
        return { success: false, error: result.error || "Đăng nhập thất bại" };
      }
    } catch (error) {
      console.error("Lỗi đăng nhập context:", error);
      setLoading(false);
      return { success: false, error: error.message || "Đăng nhập thất bại." };
    }
  };

  const signup = async (userData) => {
    // Logic signup không thay đổi nhiều, chỉ là gọi API
    try {
      const result =
        userData.role === "candidate"
          ? await authAPI.registerCandidate(userData)
          : await authAPI.registerRecruiter(userData);
      return result; // Trả về kết quả từ authAPI
    } catch (error) {
      console.error("Lỗi đăng ký context:", error);
      return { success: false, error: error.message || "Đăng ký thất bại." };
    }
  };

  const logout = () => {
    authAPI.logout(); // Hàm này sẽ xóa localStorage và điều hướng
    setUser(null);
    setIsAuthenticated(false);
    // Điều hướng đã được xử lý trong authAPI.logout() hoặc component gọi hàm này
  };

  const resetPassword = async (email) => {
    try {
      return await authAPI.forgotPassword(email);
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu context:", error);
      return {
        success: false,
        error: error.message || "Yêu cầu đặt lại mật khẩu thất bại.",
      };
    }
  };

  const loginWithGoogle = () => {
    // Endpoint backend để bắt đầu OAuth2 flow
    const backendOAuthUrl = `${
      process.env.REACT_APP_API_URL || "http://localhost:8080/api"
    }/oauth2/authorize`;
    // URL callback của frontend mà backend sẽ redirect về
    const frontendCallbackUrl = `${window.location.origin}/oauth2/callback`;
    // Tạo URL đầy đủ cho backend
    const authorizeUrl = `${backendOAuthUrl}?redirect_uri=${encodeURIComponent(
      frontendCallbackUrl
    )}`;
    window.location.href = authorizeUrl;
  };

  const handleGoogleOAuthCallback = async (code) => {
    setLoading(true);
    try {
      const result = await authAPI.loginWithGoogleOAuth(code);
      if (result.success && result.user) {
        // authAPI.loginWithGoogleOAuth đã lưu token và user
        setUser(result.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: result.user };
      } else {
        setLoading(false);
        return {
          success: false,
          error: result.error || "Xác thực Google OAuth thất bại.",
        };
      }
    } catch (error) {
      console.error("Lỗi xác thực Google OAuth context:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Xác thực Google OAuth thất bại.",
      };
    }
  };

  // Cung cấp hàm để cập nhật user từ bên ngoài (ví dụ sau khi cập nhật profile)
  const updateUserContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Cập nhật cả localStorage
  };

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    handleGoogleOAuthCallback,
    updateUserContext, // Thêm hàm này
    checkAuthStatus, // Có thể cần gọi lại từ bên ngoài
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
