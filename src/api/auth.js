import axios from 'axios';

// Create axios instance for auth API
const authAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Dữ liệu mẫu cho người dùng
const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    phone: "0987654321",
    address: "Hà Nội, Việt Nam",
    avatar: null,
    createdAt: "2023-07-10T08:30:00Z",
    verified: true
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "user@example.com",
    password: "password123",
    role: "user",
    phone: "0123456789",
    address: "Hồ Chí Minh, Việt Nam",
    avatar: null,
    createdAt: "2023-07-15T10:45:00Z",
    verified: true
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "employer@example.com",
    password: "password123",
    role: "employer",
    phone: "0369852147",
    address: "Đà Nẵng, Việt Nam",
    avatar: null,
    createdAt: "2023-07-20T14:15:00Z",
    verified: true
  }
];

// Mock tokens for password reset and email verification
const mockTokens = [];

// Add token to requests if available
authAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle response errors
authAPI.interceptors.response.use(
  response => response,
  error => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page, but avoid infinite loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Login user
export const login = async (email, password) => {
  try {
    // Tìm user trong dữ liệu mẫu
    const user = mockUsers.find(user => 
      user.email === email && user.password === password
    );
    
    if (user) {
      // Không gửi mật khẩu về client
      const { password, ...userWithoutPassword } = user;
      
      // Tạo token giả
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      // Lưu token và thông tin người dùng
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Invalid email or password.' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please check your credentials.' };
  }
};

// Register user
export const register = async (userData) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    if (mockUsers.some(user => user.email === userData.email)) {
      return { success: false, error: 'Email already exists.' };
    }
    
    // Tạo người dùng mới
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      verified: false // Cần xác minh email
    };
    
    // Thêm vào danh sách người dùng
    mockUsers.push(newUser);
    
    // Không gửi mật khẩu về client
    const { password, ...userWithoutPassword } = newUser;
    
    // Tạo token giả
    const token = `mock-token-${newUser.id}-${Date.now()}`;
    
    // Lưu token và thông tin người dùng
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return { success: true };
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    // Kiểm tra email có tồn tại không
    const user = mockUsers.find(user => user.email === email);
    
    if (!user) {
      return { success: false, error: 'Email not found.' };
    }
    
    // Tạo token reset password
    const resetToken = `reset-${user.id}-${Date.now()}`;
    
    // Lưu token (trong thực tế sẽ lưu vào database)
    mockTokens.push({
      userId: user.id,
      token: resetToken,
      type: 'reset',
      expiresAt: new Date(Date.now() + 3600000).toISOString() // Hết hạn sau 1 giờ
    });
    
    console.log(`Reset password link would be sent to ${email} with token: ${resetToken}`);
    
    return { 
      success: true, 
      message: 'Password reset instructions have been sent to your email.' 
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, error: 'Failed to process forgot password request.' };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    // Tìm token trong danh sách
    const tokenData = mockTokens.find(t => t.token === token && t.type === 'reset');
    
    if (!tokenData) {
      return { success: false, error: 'Invalid or expired token.' };
    }
    
    // Kiểm tra token hết hạn chưa
    if (new Date(tokenData.expiresAt) < new Date()) {
      return { success: false, error: 'Token has expired.' };
    }
    
    // Tìm user và cập nhật mật khẩu
    const userIndex = mockUsers.findIndex(user => user.id === tokenData.userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        password
      };
      
      // Xóa token đã sử dụng
      const tokenIndex = mockTokens.findIndex(t => t.token === token);
      if (tokenIndex !== -1) {
        mockTokens.splice(tokenIndex, 1);
      }
      
      return { success: true, message: 'Password has been reset successfully.' };
    } else {
      return { success: false, error: 'User not found.' };
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password.' };
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    // Tìm token trong danh sách
    const tokenData = mockTokens.find(t => t.token === token && t.type === 'verify');
    
    if (!tokenData) {
      return { success: false, error: 'Invalid or expired token.' };
    }
    
    // Kiểm tra token hết hạn chưa
    if (new Date(tokenData.expiresAt) < new Date()) {
      return { success: false, error: 'Token has expired.' };
    }
    
    // Tìm user và cập nhật trạng thái xác minh
    const userIndex = mockUsers.findIndex(user => user.id === tokenData.userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        verified: true
      };
      
      // Xóa token đã sử dụng
      const tokenIndex = mockTokens.findIndex(t => t.token === token);
      if (tokenIndex !== -1) {
        mockTokens.splice(tokenIndex, 1);
      }
      
      return { success: true, message: 'Email has been verified successfully.' };
    } else {
      return { success: false, error: 'User not found.' };
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error: 'Failed to verify email.' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      return { success: false };
    }
    
    const user = JSON.parse(userJson);
    
    // Kiểm tra xem người dùng có trong hệ thống không
    const existingUser = mockUsers.find(u => u.id === user.id);
    
    if (!existingUser) {
      // Người dùng không tồn tại, đăng xuất
      logout();
      return { success: false };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Get current user error:', error);
    return { success: false };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!currentUser) {
      return { success: false, error: 'User not logged in.' };
    }
    
    // Tìm và cập nhật thông tin người dùng
    const userIndex = mockUsers.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      // Các trường không được phép cập nhật
      const { id, email, role, password, createdAt, verified, ...updatableFields } = userData;
      
      // Cập nhật thông tin
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updatableFields
      };
      
      // Không gửi mật khẩu về client
      const { password: pwd, ...updatedUser } = mockUsers[userIndex];
      
      // Cập nhật thông tin người dùng trong localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: 'User not found.' };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!currentUser) {
      return { success: false, error: 'User not logged in.' };
    }
    
    // Tìm người dùng
    const userIndex = mockUsers.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
      // Kiểm tra mật khẩu hiện tại
      if (mockUsers[userIndex].password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect.' };
      }
      
      // Cập nhật mật khẩu mới
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        password: newPassword
      };
      
      return { success: true, message: 'Password changed successfully.' };
    } else {
      return { success: false, error: 'User not found.' };
    }
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password.' };
  }
};

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  changePassword
};