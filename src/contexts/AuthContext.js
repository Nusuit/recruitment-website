import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in when the app loads
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful login
      const userData = {
        id: 'user123',
        name: 'John Doe',
        email,
        role: email.includes('admin') ? 'admin' : 'applicant'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Signup function
  const signup = async (userData) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful signup
      const newUser = {
        id: 'user' + Math.floor(Math.random() * 1000),
        ...userData,
        role: 'applicant'
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Reset password function
  const resetPassword = async (email) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll just return success
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        login,
        signup,
        logout,
        resetPassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;