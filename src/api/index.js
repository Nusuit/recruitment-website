// src/api/index.js

import * as jobFunctions from "./jobs"; 
import auth from "./auth"; 

export { default as applicantAPI } from "./applicant"; 
export { default as recruiterAPI } from "./recruiter";
export { default as axiosInstance } from "./config/axiosConfig";

export { auth as authAPI }; // Tái xuất auth.js dưới tên authAPI

export const jobAPI = jobFunctions; // Tái xuất jobFunctions dưới tên jobAPI