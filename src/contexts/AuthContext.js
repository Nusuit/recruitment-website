import React, { Component, createContext } from "react";
import authAPI from "../api/auth"; // Import authAPI from your existing setup
import candidateAPI from "../api/candidate"; // Import candidateAPI for profile fetching if needed

export const AuthContext = createContext();

export class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      isAuthenticated: false,
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.handleGoogleOAuthCallback = this.handleGoogleOAuthCallback.bind(this);
  }

  // Lifecycle method to check authentication status when component mounts
  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Optionally, verify token with backend to ensure it's still valid
        // For now, assume if token and user exist, they are authenticated
        this.setState(
          {
            user: JSON.parse(storedUser),
            isAuthenticated: true,
            loading: false,
          },
          () =>
            console.log(
              "AuthContext đã tải, isAuthenticated: true, state:",
              this.state
            )
        );
      } else {
        this.setState({ loading: false }, () =>
          console.log(
            "AuthContext đã tải, isAuthenticated: false, state:",
            this.state
          )
        );
      }
    } catch (error) {
      console.error("Lỗi kiểm tra xác thực:", error);
      this.setState({ loading: false });
    }
  }

  // Method to handle user login
  async login(email, password) {
    try {
      const result = await authAPI.login(email, password);
      if (result.success) {
        this.setState({
          user: result.user,
          isAuthenticated: true,
        });
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, error: error.message || "Đăng nhập thất bại." };
    }
  }

  // Method to handle user signup
  async signup(userData) {
    try {
      // Assuming registerCandidate and registerRecruiter are in authAPI
      const result =
        userData.role === "candidate"
          ? await authAPI.registerCandidate(userData)
          : await authAPI.registerRecruiter(userData);

      if (result.success) {
        // For signup, we might not immediately set user, but redirect to verification
        return {
          success: true,
          message: result.message || "Đăng ký thành công.",
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return { success: false, error: error.message || "Đăng ký thất bại." };
    }
  }

  // Method to handle user logout
  logout() {
    authAPI.logout(); // This should clear local storage and redirect
    this.setState({ user: null, isAuthenticated: false });
  }

  // Method to handle password reset request
  async resetPassword(email) {
    try {
      const result = await authAPI.forgotPassword(email); // Assuming forgotPassword is in authAPI
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      return {
        success: false,
        error: error.message || "Yêu cầu đặt lại mật khẩu thất bại.",
      };
    }
  }

  // Method to initiate Google OAuth2 login
  loginWithGoogle() {
    // Construct the redirect URL for the frontend after backend authentication
    const frontUrl = `${window.location.origin}/oauth2/callback`; // Frontend callback URL
    const backendOAuthUrl = `/api/oauth2/authorize?redirect_uri=${encodeURIComponent(
      frontUrl
    )}`;
    window.location.href = backendOAuthUrl; // Redirect to backend OAuth2 endpoint
  }

  // Method to handle the Google OAuth2 callback and exchange code for token
  async handleGoogleOAuthCallback(code) {
    try {
      const result = await authAPI.loginWithGoogleOAuth(code); // Assuming this API call exists
      if (result.success) {
        this.setState({
          user: result.user,
          isAuthenticated: true,
        });
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Lỗi xác thực Google OAuth:", error);
      return {
        success: false,
        error: error.message || "Xác thực Google OAuth thất bại.",
      };
    }
  }

  render() {
    const { user, loading, isAuthenticated } = this.state;
    const { children } = this.props;

    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          isAuthenticated,
          login: this.login,
          signup: this.signup,
          logout: this.logout,
          resetPassword: this.resetPassword,
          loginWithGoogle: this.loginWithGoogle,
          handleGoogleOAuthCallback: this.handleGoogleOAuthCallback,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContext;
