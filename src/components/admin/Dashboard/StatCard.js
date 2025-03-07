// src/components/admin/Dashboard/StatCard.js
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ title, value, icon, change, changeType, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center">
        <div className={`${bgColor} rounded-lg p-3 mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 border-t">
        <div className="flex items-center">
          {changeType === 'increase' ? (
            <FaArrowUp className="text-green-500 mr-1" />
          ) : (
            <FaArrowDown className="text-red-500 mr-1" />
          )}
          <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
            {change}
          </span>
          <span className="text-gray-500 text-sm ml-1">so với tháng trước</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

