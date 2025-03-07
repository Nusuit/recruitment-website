// src/context/NotificationContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useContext(AuthContext);

  // Fetch notifications from API
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  // Tìm nạp thông báo - mock API call
  const fetchNotifications = async () => {
    try {
      // Trong thực tế, đây sẽ là API call
      const mockNotifications = [
        {
          id: 1,
          type: 'success',
          title: 'Ứng tuyển thành công',
          message: 'Hồ sơ của bạn đã được gửi đến công ty Tech Solutions',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          type: 'warning',
          title: 'Hạn nộp hồ sơ sắp hết',
          message: 'Việc làm Frontend Developer tại CodeMasters sẽ đóng trong 2 ngày',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: false
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi tải thông báo:', error);
      setLoading(false);
    }
  };

  // Đánh dấu thông báo đã đọc
  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );

    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);

    // Trong thực tế, bạn sẽ gọi API để cập nhật trạng thái
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));

    setNotifications(updatedNotifications);
    setUnreadCount(0);

    // Trong thực tế, bạn sẽ gọi API để cập nhật trạng thái
  };

  // Thêm thông báo mới
  const addNotification = (newNotification) => {
    const updatedNotifications = [
      { ...newNotification, id: Date.now(), read: false },
      ...notifications
    ];

    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount + 1);
  };

  // Xóa thông báo
  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );

    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        removeNotification,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook để sử dụng context một cách dễ dàng
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};