// src/components/client/Application/CVUpload.js
import React, { useRef, useState } from 'react';
import { FaUpload, FaFilePdf, FaFileWord, FaFileAlt, FaTrash } from 'react-icons/fa';

const CVUpload = ({ onUpload, onRemove, file, error }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return <FaFilePdf className="text-red-500 text-xl mr-2" />;
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FaFileWord className="text-blue-500 text-xl mr-2" />;
    } else {
      return <FaFileAlt className="text-gray-500 text-xl mr-2" />;
    }
  };

  return (
    <div className="mb-1">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-md p-4 text-center ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <FaUpload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-700">
            Kéo và thả CV của bạn vào đây, hoặc{' '}
            <span className="text-blue-600">nhấp để chọn file</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Hỗ trợ file PDF, DOC, DOCX</p>
        </div>
      ) : (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="flex items-center">
            {getFileIcon(file.name)}
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTrash />
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CVUpload;