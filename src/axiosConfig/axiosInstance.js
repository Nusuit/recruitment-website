import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Để handle refresh token trong cookie
});

// Biến để theo dõi xem có đang refresh token hay không
let isRefreshing = false;
// Mảng để lưu trữ các request đang chờ trong khi refresh token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add interceptor để refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Unauthorized) và chưa thử lại
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // Đánh dấu request này là đã thử lại
      originalRequest._retry = true;

      // Nếu chưa có quá trình refresh nào đang diễn ra
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Lấy role của người dùng từ localStorage để chọn đúng endpoint refresh token
          const userString = localStorage.getItem('user');
          let userRole = 'applicant'; // Mặc định là applicant
          if (userString) {
            try {
              const user = JSON.parse(userString);
              if (user.role) {
                userRole = user.role.toLowerCase();
              }
            } catch (parseError) {
              console.error("Failed to parse user from localStorage:", parseError);
            }
          }
          
          const refreshEndpoint = `/auth/${userRole}/login/refresh`;
          console.log(`[axiosInstance] Attempting to refresh token for role: ${userRole} at ${refreshEndpoint}`);

          const refreshResponse = await axiosInstance.post(refreshEndpoint);
          const newAccessToken = refreshResponse.data?.payload?.accessToken; // Lấy accessToken mới từ payload

          if (newAccessToken) {
            localStorage.setItem('token', newAccessToken); // Lưu token mới
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken); // Xử lý các request đang chờ
            // Gửi lại request ban đầu với token mới
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } else {
            // Không nhận được accessToken mới, có thể refreshToken cũng hết hạn
            processQueue(new Error('Failed to refresh token: No new access token.'), null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError.response?.data || refreshError);
          processQueue(refreshError, null); // Thông báo lỗi cho các request đang chờ
          // Nếu refresh token thất bại, đăng xuất người dùng
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Nếu đã có quá trình refresh đang diễn ra, đưa request vào hàng đợi
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
    }
    // Nếu không phải lỗi 401 hoặc đã thử lại, hoặc lỗi không phải từ response
    return Promise.reject(error);
  }
);

export default axiosInstance;
