// src/components/client/JobDetail/JobDescription.js
import React from 'react';

const JobDescription = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả công việc</h2>
        <div className="text-gray-700 whitespace-pre-line">{job.description}</div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Yêu cầu công việc</h2>
        <div className="text-gray-700 whitespace-pre-line">{job.requirements}</div>
      </div>

      {job.benefits && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quyền lợi</h2>
          <div className="text-gray-700 whitespace-pre-line">{job.benefits}</div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;

