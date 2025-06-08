// src/pages/applicant/JobApplyPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext";
import ApplyForm from "../../components/jobs/ApplyForm"; // The refactored ApplyForm
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JobApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    getJobById,
    loading: jobsLoading,
    error: jobsError,
  } = useContext(JobsContext);

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Local loading for this page

  useEffect(() => {
    if (jobsLoading) {
      setIsLoading(true);
      return;
    }
    setIsLoading(true);
    const fetchJob = async () => {
      try {
        if (!jobId) {
          console.error("JobApplyPage - No jobId provided");
          return;
        }
        const fetchedJob = await getJobById(jobId);
        if (fetchedJob) {
          setJob(fetchedJob);
          console.log("JobApplyPage - Fetched job:", fetchedJob);
        } else {
          console.error("JobApplyPage - Job not found");
        }
      } catch (err) {
        console.error("Error fetching job details for apply page:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId, getJobById, jobsLoading]);

  const handleApplicationSuccess = (submittedApplication) => {
    navigate("/applicant/applications", {
      state: {
        successMessage: `Successfully applied for ${submittedApplication.job?.title || job?.title}!`,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading job application form..." />;
  }

  if (!jobId) {
    return (
      <EmptyState
        title="Invalid Job"
        description="No job ID was provided. Please select a job to apply for."
        icon="exclamation-triangle"
      />
    );
  }

  if (jobsError) {
    return (
      <EmptyState
        title="Error Loading Job"
        description={jobsError}
        icon="exclamation-triangle"
      />
    );
  }

  if (!job) {
    return (
      <EmptyState
        title="Job Not Found"
        description="The job you are trying to apply for could not be found."
        icon="search"
      />
    );
  }

  return (
    <div className="job-apply-page container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <FontAwesomeIcon
            icon="file-signature"
            className="text-5xl text-blue-600 mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Apply for: {job.title}
          </h1>
          <p className="text-md text-gray-600 mt-2">
            <FontAwesomeIcon icon="building" className="mr-1.5" />
            {job.company}
            <span className="mx-2 text-gray-300">|</span>
            <FontAwesomeIcon icon="map-marker-alt" className="mr-1.5" />
            {job.location}
          </p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl border border-gray-100">
          <ApplyForm
            jobId={jobId}
            jobTitle={job.title}
            onSubmitSuccess={handleApplicationSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default JobApplyPage;
