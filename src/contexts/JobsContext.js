// src/contexts/JobsContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { jobAPI, applicantAPI } from "../api";
import { recruiterAPI } from "../api/recruiter";
import { AuthContext } from "./AuthContext";

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Keep track of current filters
  const [currentFilters, setCurrentFilters] = useState({
    page: 0,
    size: 10,
    sort: 'createdAt,desc'
  });

  const fetchAllJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      // Use different API based on user role
      if (user?.role?.toLowerCase() === 'recruiter') {
        console.log("🔧 [JobsContext] Fetching jobs for recruiter using recruiterAPI");
        response = await recruiterAPI.getJobs(filters);
      } else {
        // For applicant/guest, use public jobs API
        console.log("🔧 [JobsContext] Fetching public jobs for guest/applicant using jobAPI");
        response = await jobAPI.getJobs(filters);
      }
      
      // Handle API response structure
      if (response && response.success && response.payload) {
        if (Array.isArray(response.payload.content)) {
          // Filter out non-active jobs for non-recruiters
          const jobsList = user?.role?.toLowerCase() === 'recruiter' 
            ? response.payload.content
            : response.payload.content.filter(job => job.status === "OPEN" || job.status === "ACTIVE");

          setJobs(jobsList);
          setTotalPages(response.payload.totalPages);
          setTotalElements(response.payload.totalElements);
          setCurrentFilters(filters);
        } else if (Array.isArray(response.payload)) {
          const jobsList = user?.role?.toLowerCase() === 'recruiter'
            ? response.payload
            : response.payload.filter(job => job.status === "OPEN" || job.status === "ACTIVE");

          setJobs(jobsList);
          setTotalPages(1);
          setTotalElements(jobsList.length);
          setCurrentFilters(filters);
        } else {
          console.log("🔧 [JobsContext] API returned unexpected format");
          setJobs([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      } else {
        console.log("🔧 [JobsContext] API error:", response);
        setJobs([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error fetching all jobs:", error);
      setError(error);
      setJobs([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch jobs on mount and when user changes
  useEffect(() => {
    fetchAllJobs(currentFilters);
  }, [fetchAllJobs]);

  // Check for new jobs less frequently (every 30 seconds)
  useEffect(() => {
    const checkForNewJobs = () => {
      const newJobFlag = sessionStorage.getItem('newPublicJobAvailable');
      if (newJobFlag === 'true') {
        console.log("🔔 [JobsContext] New public job available, refreshing...");
        sessionStorage.removeItem('newPublicJobAvailable');
        fetchAllJobs(currentFilters);
      }
    };

    const interval = setInterval(() => {
      if (!document.hidden) {
        checkForNewJobs();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [fetchAllJobs, currentFilters]);

  const fetchUserSpecificData = useCallback(async () => {
    if (isAuthenticated && user && user.role?.toLowerCase() === 'applicant') {
      setOperationLoading(true);
      setError(null);
      try {
        // Fetch saved jobs and applications
        const [savedJobsResponse, appsResponse] = await Promise.all([
          applicantAPI.getMySavedJobs(),
          applicantAPI.getApplications(),
        ]);

        // Handle saved jobs
        let savedJobs = [];
        if (savedJobsResponse?.success) {
          if (Array.isArray(savedJobsResponse.payload)) {
            savedJobs = savedJobsResponse.payload;
          } else if (savedJobsResponse.payload?.content) {
            savedJobs = savedJobsResponse.payload.content;
          }
        }
        setSavedJobIds(savedJobs.map(job => job?.id?.toString() || '').filter(Boolean));

        // Handle applications
        let applications = [];
        if (appsResponse?.success) {
          if (Array.isArray(appsResponse.payload)) {
            applications = appsResponse.payload;
          } else if (appsResponse.payload?.content) {
            applications = appsResponse.payload.content;
          }
        }
        setApplications(applications);

      } catch (err) {
        console.error("Error fetching user-specific job data:", err);
        setError(err.message || "Could not load your saved jobs or applications.");
        setSavedJobIds([]);
        setApplications([]);
      } finally {
        setOperationLoading(false);
      }
    } else {
      setSavedJobIds([]);
      setApplications([]);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchUserSpecificData();
  }, [fetchUserSpecificData]);

  const getJobById = useCallback(
    async (jobId) => {
      // First try to find the job in the local state
      const localJob = jobs.find(
        (job) => job && (job.id?.toString() === jobId?.toString() || job.jobId?.toString() === jobId?.toString())
      );
      if (localJob) {
        console.log("🔍 [JobsContext] Found job in local state:", localJob);
        return localJob;
      }

      // If not found locally, fetch from API
      setOperationLoading(true);
      try {
        console.log("🔍 [JobsContext] Fetching job from API:", jobId);
        const response = await jobAPI.getJobById(jobId);
        
        if (response && response.success && response.payload) {
          console.log("🔍 [JobsContext] API response:", response);
          return response.payload;
        } else {
          console.error("🔍 [JobsContext] Invalid API response:", response);
          throw new Error(
            response?.message || `Job with ID ${jobId} not found via API.`
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
          response = await applicantAPI.unsaveJob(jobId);
        } else {
          response = await applicantAPI.saveJob(jobId);
        }

        if (response) { 
          setSavedJobIds((prevIds) =>
            currentlySaved
              ? prevIds.filter((id) => id !== jobId.toString())
              : [...prevIds, jobId.toString()]
          );
          return { success: true, isSaved: !currentlySaved };
        } else {
          throw new Error(
            response?.message ||
              `Failed to ${currentlySaved ? "unsave" : "save"} job.`
          );
        }
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
    return jobs.filter((job) => job && job.id && savedJobIds.includes(job.id.toString()));
  }, [jobs, savedJobIds]);

  const submitApplication = useCallback(
    async (jobId, applicationData) => {
      if (!isAuthenticated || user?.role?.toLowerCase() !== 'applicant') {
        alert("Please log in as an applicant to apply for jobs.");
        return { success: false, error: "Not authenticated or not an applicant" };
      }

      if (!jobId) {
        console.error("No job ID provided for application");
        return { success: false, error: "No job ID provided" };
      }

      // Convert jobId to number
      const numericJobId = parseInt(jobId, 10);
      if (isNaN(numericJobId)) {
        console.error("Invalid job ID:", jobId);
        return { success: false, error: "Invalid job ID" };
      }

      setOperationLoading(true);
      try {
        console.log("Submitting application for job ID:", numericJobId);
        const requestData = {
          coverLetter: applicationData.coverLetter || ""
        };
        const response = await applicantAPI.applyJob(numericJobId, requestData);
        
        if (response.success) {
          // Refresh the applications list to get the latest data
          await fetchUserSpecificData();
          return { success: true, data: response.payload };
        } else {
          throw new Error(response.message || "Failed to submit application");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        // Refresh the applications list even on error to ensure we have the latest state
        await fetchUserSpecificData();
        return {
          success: false,
          error: error.message || "Failed to submit application"
        };
      } finally {
        setOperationLoading(false);
      }
    },
    [isAuthenticated, user, fetchUserSpecificData]
  );

  const getUserApplications = useCallback(() => {
    return applications;
  }, [applications]);

  const hasAppliedToJob = useCallback(
    (jobId) => {
      return applications.some(
        (app) => app && app.jobId && app.jobId.toString() === jobId.toString()
      );
    },
    [applications]
  );

  const contextValue = {
    jobs,
    loading,
    error,
    operationLoading,
    totalPages,
    totalElements,
    currentFilters,
    fetchAllJobs,
    getJobById,
    toggleSaveJob,
    isJobSaved,
    getSavedJobs,
    submitApplication,
    getUserApplications,
    hasAppliedToJob,
    setLoading,
  };

  return (
    <JobsContext.Provider value={contextValue}>
      {children}
    </JobsContext.Provider>
  );
};
