// src/contexts/JobsContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { jobAPI, candidateAPI } from "../api"; // Assuming API modules
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
      const response = await jobAPI.getAllPublicJobs(filters); // Pass filters to API
      if (response.success && Array.isArray(response.data)) {
        setJobs(response.data);
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
    if (isAuthenticated && user) {
      setOperationLoading(true); // Use operationLoading or a specific loading state
      setError(null);
      try {
        const [savedJobsResponse, appsResponse] = await Promise.all([
          candidateAPI.getMySavedJobs(),
          candidateAPI.getMyApplications(),
        ]);

        if (
          savedJobsResponse.success &&
          Array.isArray(savedJobsResponse.data)
        ) {
          setSavedJobIds(
            savedJobsResponse.data.map((job) => job.id.toString())
          ); // Store only IDs
        } else {
          console.warn(
            "Failed to fetch saved jobs or no saved jobs found:",
            savedJobsResponse.error
          );
          setSavedJobIds([]); // Reset if fetch fails or no data
        }

        if (appsResponse.success && Array.isArray(appsResponse.data)) {
          setApplications(appsResponse.data);
        } else {
          console.warn(
            "Failed to fetch applications or no applications found:",
            appsResponse.error
          );
          setApplications([]); // Reset if fetch fails or no data
        }
      } catch (err) {
        console.error("Error fetching user-specific job data:", err);
        setError(
          err.message || "Could not load your saved jobs or applications."
        );
        // Keep existing data on error or clear them? Depends on desired UX.
        // setSavedJobIds([]);
        // setApplications([]);
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
  }, [fetchUserSpecificData]); // Runs when isAuthenticated or user changes

  const getJobById = useCallback(
    async (jobId) => {
      // First, check if job is already in the local 'jobs' state
      const localJob = jobs.find(
        (job) => job.id.toString() === jobId.toString()
      );
      if (localJob) return localJob;

      // If not found locally, fetch from API
      setOperationLoading(true);
      try {
        const response = await jobAPI.getJobDetails(jobId);
        if (response.success && response.data) {
          // Optionally add/update this job in the main 'jobs' list if it's not there
          // or if you want to ensure it's the most up-to-date version.
          // For simplicity, just returning it here.
          return response.data;
        } else {
          throw new Error(
            response.error || `Job with ID ${jobId} not found via API.`
          );
        }
      } catch (err) {
        console.error(`Error fetching job ${jobId}:`, err);
        setError(`Could not load details for job ${jobId}.`); // Set context error
        return null;
      } finally {
        setOperationLoading(false);
      }
    },
    [jobs]
  );

  const toggleSaveJob = useCallback(
    async (jobId) => {
      if (!isAuthenticated) {
        // Consider navigating to login or showing a modal
        alert("Please log in to save jobs.");
        return { success: false, error: "Not authenticated" };
      }
      setOperationLoading(true);
      const currentlySaved = savedJobIds.includes(jobId.toString());
      try {
        let response;
        if (currentlySaved) {
          response = await candidateAPI.unsaveJob(jobId);
        } else {
          response = await candidateAPI.saveJob(jobId);
        }

        if (response.success) {
          // Re-fetch saved jobs to ensure consistency or update local state optimistically
          // For optimistic update:
          setSavedJobIds((prevIds) =>
            currentlySaved
              ? prevIds.filter((id) => id !== jobId.toString())
              : [...prevIds, jobId.toString()]
          );
          // Or fetchUserSpecificData(); // To get the latest from server
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
    [isAuthenticated, savedJobIds /*, fetchUserSpecificData (if using) */]
  );

  const isJobSaved = useCallback(
    (jobId) => {
      return savedJobIds.includes(jobId.toString());
    },
    [savedJobIds]
  );

  const getSavedJobs = useCallback(() => {
    // This returns full job objects by filtering the main `jobs` list
    return jobs.filter((job) => savedJobIds.includes(job.id.toString()));
  }, [jobs, savedJobIds]);

  const submitApplication = useCallback(
    async (jobId, applicationData) => {
      if (!isAuthenticated) {
        alert("Please log in to apply for jobs.");
        return { success: false, error: "Not authenticated" };
      }
      setOperationLoading(true);
      try {
        // API call to submit application.
        // If `applicationData.resume` is a File object, candidateAPI.submitApplication needs to handle FormData.
        const response = await candidateAPI.submitApplication(
          jobId,
          applicationData
        );

        if (response.success && response.application) {
          setApplications((prev) => [...prev, response.application]); // Add new application to local state
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
    [isAuthenticated]
  );

  const getUserApplications = useCallback(() => {
    // Returns applications from local state. fetchUserSpecificData populates this.
    return applications;
  }, [applications]);

  const hasAppliedToJob = useCallback(
    (jobId) => {
      return applications.some(
        (app) => app.jobId.toString() === jobId.toString()
      );
    },
    [applications]
  );

  const contextValue = {
    jobs,
    loading, // For initial job list load
    error,
    operationLoading, // For actions like save, apply
    setLoading, // Expose if needed by pages for custom loading states
    setError,
    fetchAllJobs, // To allow re-fetching with filters from pages
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
