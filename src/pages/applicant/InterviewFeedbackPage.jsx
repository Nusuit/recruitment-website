// src/pages/applicant/InterviewFeedbackPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { JobsContext } from "../../contexts/JobsContext"; // To get application details
// import { candidateAPI } from '../../api/candidate'; // If direct API call is preferred
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate, formatApplicationStatus } from "../../utils/formatters";

const ratingCategories = [
  {
    id: "overallExperience",
    label: "Overall Interview Experience",
    low: "Poor",
    high: "Excellent",
  },
  {
    id: "interviewerProfessionalism",
    label: "Interviewer Professionalism",
    low: "Unprofessional",
    high: "Very Professional",
  },
  {
    id: "clarityOfRole",
    label: "Clarity of the Role Discussed",
    low: "Unclear",
    high: "Very Clear",
  },
  {
    id: "questionRelevance",
    label: "Relevance of Questions Asked",
    low: "Irrelevant",
    high: "Very Relevant",
  },
  {
    id: "yourPerformanceFeel",
    label: "How You Felt About Your Performance",
    low: "Not Good",
    high: "Great",
  },
];

const InterviewFeedbackPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { getUserApplications, loading: jobsContextLoading } =
    useContext(JobsContext);

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const initialFeedbackState = ratingCategories.reduce(
    (acc, category) => {
      acc[category.id] = 5; // Default rating
      return acc;
    },
    { comments: "", wouldRecommendCompany: null }
  ); // null for yes/no/unset

  const [feedback, setFeedback] = useState(initialFeedbackState);

  useEffect(() => {
    if (jobsContextLoading) return;

    setLoading(true);
    setError(null);
    try {
      const userApps = getUserApplications();
      const currentApp = userApps.find(
        (app) => app.id.toString() === applicationId
      );

      if (currentApp) {
        setApplication(currentApp);
        // TODO: Check if feedback already submitted and prefill or disable form
        // if (currentApp.interviewFeedback) {
        //     setFeedback(currentApp.interviewFeedback);
        //     setSubmitSuccess(true); // If already submitted
        // }
      } else {
        setError("Application not found.");
      }
    } catch (err) {
      console.error("Error fetching application for feedback:", err);
      setError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  }, [applicationId, getUserApplications, jobsContextLoading]);

  const handleRatingChange = (field, value) => {
    setFeedback((prev) => ({ ...prev, [field]: parseInt(value, 10) }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecommendChange = (value) => {
    setFeedback((prev) => ({ ...prev, wouldRecommendCompany: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // TODO: API call to submit feedback
      // await candidateAPI.submitInterviewFeedback(applicationId, feedback);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API
      setSubmitSuccess(true);
      // Optionally, update application in JobsContext if feedback is stored there
      setTimeout(() => {
        navigate(`/applicant/applications/${applicationId}`);
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading feedback form..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error"
        description={error}
        icon="exclamation-triangle"
      />
    );
  }

  if (!application) {
    return (
      <EmptyState
        title="Application Not Found"
        description="Could not retrieve application details."
        icon="file-excel"
      />
    );
  }

  if (submitSuccess && !isSubmitting) {
    // Check !isSubmitting to avoid flash before redirect
    return (
      <div className="p-4 md:p-8 text-center">
        <FontAwesomeIcon
          icon="check-circle"
          className="text-6xl text-green-500 mb-6"
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Thank You for Your Feedback!
        </h2>
        <p className="text-gray-600 mb-6">
          Your insights help us improve our interview process.
        </p>
        <p className="text-gray-500 text-sm">
          Redirecting you back to the application details...
        </p>
      </div>
    );
  }

  return (
    <div className="interview-feedback-page container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          to={`/applicant/applications/${applicationId}`}
          className="text-blue-600 hover:underline flex items-center mb-4 text-sm"
        >
          <FontAwesomeIcon icon="arrow-left" className="mr-2" />
          Back to Application
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Interview Feedback
        </h1>
        <p className="text-gray-600 mt-1">
          For: <span className="font-semibold">{application.jobTitle}</span> at{" "}
          {application.company}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-10 rounded-xl shadow-xl border border-gray-100 space-y-8"
      >
        {error && (
          <div
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Rating Sections */}
        {ratingCategories.map((category) => (
          <div key={category.id} className="rating-category">
            <label className="block text-md font-semibold text-gray-700 mb-2">
              {category.label}
            </label>
            <div className="flex items-center justify-between space-x-1 sm:space-x-2 bg-gray-50 p-3 rounded-lg">
              {[...Array(10)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <button
                    key={ratingValue}
                    type="button"
                    onClick={() => handleRatingChange(category.id, ratingValue)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-150 border
                                            ${
                                              feedback[category.id] ===
                                              ratingValue
                                                ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                            }`}
                    aria-label={`Rate ${ratingValue} out of 10`}
                  >
                    {ratingValue}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
              <span>{category.low}</span>
              <span>{category.high}</span>
            </div>
          </div>
        ))}

        {/* Recommendation Section */}
        <div className="recommend-section">
          <label className="block text-md font-semibold text-gray-700 mb-2">
            Would you recommend applying to MyaCorp to a friend or colleague?
          </label>
          <div className="flex space-x-4">
            {["Yes", "No", "Maybe"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleRecommendChange(option)}
                className={`px-5 py-2.5 rounded-md text-sm font-medium border transition-colors duration-150
                                    ${
                                      feedback.wouldRecommendCompany === option
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <label
            htmlFor="comments"
            className="block text-md font-semibold text-gray-700 mb-2"
          >
            Additional Comments or Suggestions
          </label>
          <textarea
            id="comments"
            name="comments"
            value={feedback.comments}
            onChange={handleTextChange}
            rows="5"
            placeholder="Share any other thoughts about your interview experience..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewFeedbackPage;
