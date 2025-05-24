// src/api/index.js

import * as jobFunctions from "./jobs"; // <<< THÊM DÒNG NÀY: Import tất cả từ jobs.js vào object 'jobFunctions'

// Giữ lại các dòng export hiện tại của bạn
export { default as candidateAPI } from "./candidate";
export { default as recruiterAPI } from "./recruiter";
export { default as axiosInstance } from "./config/axiosConfig";
export * from "./auth"; // Dòng này hoạt động tốt cho authAPI, giữ lại

// THAY THẾ 'export * from ./jobs;' BẰNG DÒNG NÀY:
export const jobAPI = jobFunctions; // <<< Export 'jobFunctions' dưới tên 'jobAPI'
