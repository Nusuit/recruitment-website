// src/pages/client/Notification.js
import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // Mock notifications data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Ứng tuyển thành công',
        message: 'Hồ sơ của bạn đã được gửi đến công ty Tech Solutions',
        timestamp: '2023-06-15T10:30:00',
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Hạn nộp hồ sơ sắp hết',
        message: 'Việc làm Frontend Developer tại CodeMasters sẽ đóng trong 2 ngày',
        timestamp: '2023-06-14T15:45:00',
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'Gợi ý việc làm',
        message: 'Có 5 việc làm mới phù hợp với kỹ năng của bạn',
        timestamp: '2023-06-13T09:15:00',
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Hàm lấy icon dựa trên loại thông báo
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-orange-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <FaBell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Không có thông báo mới
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bạn sẽ nhận được thông báo khi có cập nhật
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border flex items-start ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;