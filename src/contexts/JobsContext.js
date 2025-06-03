// src/contexts/JobsContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { jobAPI, applicantAPI } from "../api"; // Đổi từ candidateAPI thành applicantAPI
import { AuthContext } from "./AuthContext";

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]); // All public/searchable jobs
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true); // General loading for initial data
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false); // For specific operations like save/apply

  // Fetch all public jobs
  const fetchAllJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.getJobs(filters); // Pass filters to API
      if (response.success && Array.isArray(response.jobs)) { // API trả về response.jobs
        setJobs(response.jobs);
      } else {
        throw new Error(response.error || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Error fetching all jobs:", err);
      setError(err.message || "Could not load job listings.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllJobs(); // Initial fetch without filters
  }, [fetchAllJobs]);

  // Fetch user-specific data (saved jobs, applications)
  const fetchUserSpecificData = useCallback(async () => {
    if (isAuthenticated && user && user.role?.toLowerCase() === 'applicant') { // Chỉ fetch nếu là applicant
      setOperationLoading(true);
      setError(null);
      try {
        const [savedJobsResponse, appsResponse] = await Promise.all([
          applicantAPI.getMySavedJobs(), // Gọi applicantAPI
          applicantAPI.getMyApplications(), // Gọi applicantAPI
        ]);

        if (
          savedJobsResponse.success &&
          Array.isArray(savedJobsResponse.data) // Backend trả về data trong payload
        ) {
          setSavedJobIds(
            savedJobsResponse.data.map((job) => job.id.toString())
          );
        } else {
          console.warn(
            "Failed to fetch saved jobs or no saved jobs found:",
            savedJobsResponse.error
          );
          setSavedJobIds([]);
        }

        if (appsResponse.success && Array.isArray(appsResponse.data)) { // Backend trả về data trong payload
          setApplications(appsResponse.data);
        } else {
          console.warn(
            "Failed to fetch applications or no applications found:",
            appsResponse.error
          );
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching user-specific job data:", err);
        setError(
          err.message || "Could not load your saved jobs or applications."
        );
      } finally {
        setOperationLoading(false);
      }
    } else {
      // Clear data if not authenticated or not an applicant
      setSavedJobIds([]);
      setApplications([]);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchUserSpecificData();
  }, [fetchUserSpecificData]);

  const getJobById = useCallback(
    async (jobId) => {
      const localJob = jobs.find(
        (job) => job && job.id && job.id.toString() === jobId.toString() // Thêm kiểm tra an toàn
      );
      if (localJob) return localJob;

      setOperationLoading(true);
      try {
        const response = await jobAPI.getJobById(jobId);
        if (response.success && response.job) { // API trả về response.job
          return response.job;
        } else {
          throw new Error(
            response.error || `Job with ID ${jobId} not found via API.`
          );
        }
      } catch (err) {
        console.error(`Error fetching job ${jobId}:`, err);
        setError(`Could not load details for job ${jobId}.`);
        return null;
      } finally {
        setOperationLoading(false);
      }
    },
    [jobs]
  );

  const toggleSaveJob = useCallback(
    async (jobId) => {
      if (!isAuthenticated || user?.role?.toLowerCase() !== 'applicant') {
        alert("Please log in as an applicant to save jobs.");
        return { success: false, error: "Not authenticated or not an applicant" };
      }
      setOperationLoading(true);
      const currentlySaved = savedJobIds.includes(jobId.toString());
      try {
        let response;
        if (currentlySaved) {
          response = await applicantAPI.unsaveJob(jobId); // Gọi applicantAPI
        } else {
          response = await applicantAPI.saveJob(jobId); // Gọi applicantAPI
        }

        if (response.success) {
          setSavedJobIds((prevIds) =>
            currentlySaved
              ? prevIds.filter((id) => id !== jobId.toString())
              : [...prevIds, jobId.toString()]
          );
        } else {
          throw new Error(
            response.error ||
              `Failed to ${currentlySaved ? "unsave" : "save"} job.`
          );
        }
        return { success: true, isSaved: !currentlySaved };
      } catch (err) {
        console.error("Error toggling save job:", err);
        alert(err.message);
        return { success: false, error: err.message };
      } finally {
        setOperationLoading(false);
      }
    },
    [isAuthenticated, savedJobIds, user]
  );

  const isJobSaved = useCallback(
    (jobId) => {
      return savedJobIds.includes(jobId.toString());
    },
    [savedJobIds]
  );

  const getSavedJobs = useCallback(() => {
    // THÊM KIỂM TRA AN TOÀN CHO job và job.id
    return jobs.filter((job) => job && job.id && savedJobIds.includes(job.id.toString()));
  }, [jobs, savedJobIds]);

  const submitApplication = useCallback(
    async (jobId, applicationData) => {
      if (!isAuthenticated || user?.role?.toLowerCase() !== 'applicant') {
        alert("Please log in as an applicant to apply for jobs.");
        return { success: false, error: "Not authenticated or not an applicant" };
      }
      setOperationLoading(true);
      try {
        // SỬA Ở ĐÂY: jobAPI.applyForJob (theo file jobs.js)
        const response = await jobAPI.applyForJob(jobId, applicationData);

        if (response.success && response.application) {
          setApplications((prev) => [...prev, response.application]);
          return { success: true, application: response.application };
        } else {
          throw new Error(response.error || "Application submission failed");
        }
      } catch (err) {
        console.error("Error submitting application:", err);
        return {
          success: false,
          error: err.message || "Failed to submit application.",
        };
      } finally {
        setOperationLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  const getUserApplications = useCallback(() => {
    return applications;
  }, [applications]);

  const hasAppliedToJob = useCallback(
    (jobId) => {
      return applications.some(
        (app) => app && app.jobId && app.jobId.toString() === jobId.toString() // Thêm kiểm tra an toàn
      );
    },
    [applications]
  );

  const contextValue = {
    jobs,
    loading,
    error,
    operationLoading,
    setLoading,
    setError,
    fetchAllJobs,
    fetchUserSpecificData,
    getJobById,
    toggleSaveJob,
    isJobSaved,
    getSavedJobs,
    submitApplication,
    getUserApplications,
    hasAppliedToJob,
  };

  return (
    <JobsContext.Provider value={contextValue}>{children}</JobsContext.Provider>
  );
};
