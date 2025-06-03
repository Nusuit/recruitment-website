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

    // Nếu lỗi là 401 (Unauthorized) hoặc 403 (Forbidden) và chưa thử lại
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // Đánh dấu request này là đã thử lại
      originalRequest._retry = true;

      // Nếu chưa có quá trình refresh nào đang diễn ra
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi API refresh token
          // Endpoint: POST /api/auth/recruiter/login/refresh hoặc /api/auth/candidate/login/refresh
          // Tùy thuộc vào role của người dùng đang đăng nhập
          // Để đơn giản, chúng ta sẽ gọi cả hai hoặc để backend tự xử lý endpoint
          // Hoặc tốt hơn là lưu role của user trong localStorage và dùng nó để chọn endpoint
          const userRole = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).role?.toLowerCase() : 'candidate';
          const refreshEndpoint = `/auth/${userRole}/login/refresh`;

          const refreshResponse = await axiosInstance.post(refreshEndpoint);
          const newAccessToken = refreshResponse.data?.data?.accessToken; // Lấy accessToken mới

          if (newAccessToken) {
            localStorage.setItem('token', newAccessToken); // Lưu token mới
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken); // Xử lý các request đang chờ
            return axiosInstance(originalRequest); // Gửi lại request ban đầu
          } else {
            // Không nhận được accessToken mới, có thể refreshToken cũng hết hạn
            processQueue(new Error('Failed to refresh token: No new access token.'), null);
            window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
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
    // Nếu không phải lỗi 401/403 hoặc đã thử lại, hoặc lỗi không phải từ response
    return Promise.reject(error);
  }
);

export default axiosInstance;
