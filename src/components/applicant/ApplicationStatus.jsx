// src/components/applicant/ApplicationStatus.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatApplicationStatus } from "../../utils/formatters"; // Assuming this formatter exists

const ApplicationStatus = ({ status }) => {
  const formattedStatus = formatApplicationStatus(status); // Standardize status display

  const statusSteps = [
    { name: "Application Submitted", key: "pendingreview" }, // Key for matching
    { name: "In Review", key: "inreview" },
    { name: "Shortlisted", key: "shortlisted" },
    { name: "Interview Scheduled", key: "interviewscheduled" },
    { name: "Offer Extended", key: "offerextended" },
    { name: "Hired", key: "hired" },
  ];

  const isRejected =
    formattedStatus.toLowerCase() === "rejected" ||
    formattedStatus.toLowerCase() === "not selected";
  const isWithdrawn = formattedStatus.toLowerCase() === "withdrawn";

  let activeIndex = -1;
  if (!isRejected && !isWithdrawn) {
    activeIndex = statusSteps.findIndex(
      (step) => step.key === formattedStatus.toLowerCase().replace(/\s+/g, "")
    );
    if (activeIndex === -1) activeIndex = 0; // Default to first step if status is unknown but not rejected/withdrawn
  }

  const getStepClass = (index) => {
    if (isRejected || isWithdrawn) return "opacity-50"; // Dim all steps if rejected/withdrawn
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "upcoming";
  };

  const getIconForStep = (index) => {
    if (isRejected || isWithdrawn) return "times-circle";
    if (index < activeIndex) return "check-circle";
    if (index === activeIndex) return "circle-notch"; // Or 'spinner' with spin prop
    return "circle"; // fa-regular fa-circle
  };

  const getIconColor = (index) => {
    if (isRejected || isWithdrawn) return "text-red-500";
    if (index < activeIndex) return "text-green-500";
    if (index === activeIndex) return "text-blue-500 animate-pulse";
    return "text-gray-300";
  };

  return (
    <div
      className={`application-status-tracker p-6 bg-white rounded-lg shadow-md border ${
        isRejected || isWithdrawn ? "border-red-200" : "border-gray-200"
      }`}
    >
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Application Progress
        </h3>
        {(isRejected || isWithdrawn) && (
          <p
            className={`mt-1 text-md font-medium ${
              isRejected ? "text-red-600" : "text-gray-600"
            }`}
          >
            Status: {formattedStatus}
          </p>
        )}
      </div>

      <div className="relative flex flex-col items-start space-y-0">
        {" "}
        {/* Changed to flex-col for vertical stacking */}
        {statusSteps.map((step, index) => (
          <div
            key={step.key}
            className={`flex items-center w-full ${
              index < statusSteps.length - 1 ? "pb-8" : ""
            } relative`}
          >
            {/* Connector Line (Vertical) */}
            {index < statusSteps.length - 1 && (
              <div
                className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 
                                ${
                                  isRejected || isWithdrawn
                                    ? "bg-red-200"
                                    : index < activeIndex
                                    ? "bg-green-500"
                                    : index === activeIndex
                                    ? "bg-blue-200"
                                    : "bg-gray-200"
                                }
                             `}
              ></div>
            )}

            <div
              className={`z-10 flex items-center justify-center w-6 h-6 rounded-full shrink-0
                            ${
                              isRejected || isWithdrawn
                                ? "bg-red-100 border-2 border-red-400"
                                : index < activeIndex
                                ? "bg-green-100 border-2 border-green-500"
                                : index === activeIndex
                                ? "bg-blue-100 border-2 border-blue-500"
                                : "bg-gray-100 border-2 border-gray-300"
                            }
                        `}
            >
              <FontAwesomeIcon
                icon={getIconForStep(index)}
                className={`${getIconColor(index)} text-xs`}
                spin={
                  !isRejected &&
                  !isWithdrawn &&
                  index === activeIndex &&
                  getIconForStep(index) === "circle-notch"
                }
              />
            </div>
            <div className="ml-4">
              <h4
                className={`text-sm font-medium ${
                  isRejected || isWithdrawn
                    ? "text-gray-500"
                    : index <= activeIndex
                    ? "text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </h4>
              {/* You can add dates or short descriptions here if available */}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm">
        {isRejected ? (
          <p className="text-red-600">
            We appreciate your interest. While your qualifications were
            impressive, we have decided to move forward with other candidates
            for this role.
          </p>
        ) : isWithdrawn ? (
          <p className="text-gray-600">This application has been withdrawn.</p>
        ) : (
          <>
            <h4 className="font-semibold text-gray-700 mb-1">What's Next?</h4>
            {activeIndex === 0 && (
              <p className="text-gray-600">
                Your application is submitted and will be reviewed by our hiring
                team. This typically takes 3-5 business days.
              </p>
            )}
            {activeIndex === 1 && (
              <p className="text-gray-600">
                Your application is currently under review. We will notify you
                about the next steps.
              </p>
            )}
            {activeIndex === 2 && (
              <p className="text-gray-600">
                Congratulations! You've been shortlisted. Expect to hear from us
                soon regarding an interview.
              </p>
            )}
            {activeIndex === 3 && (
              <p className="text-gray-600">
                Your interview is scheduled. Please check your email for details
                and prepare accordingly.
              </p>
            )}
            {activeIndex === 4 && (
              <p className="text-gray-600">
                An offer has been extended to you! Please check your email for
                the offer details and next steps.
              </p>
            )}
            {activeIndex === 5 && (
              <p className="text-green-600 font-semibold">
                Congratulations on your new role at MyaCorp! Welcome aboard!
              </p>
            )}
            {activeIndex === -1 && !isRejected && !isWithdrawn && (
              <p className="text-gray-600">
                Your application status is being processed.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

ApplicationStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

export default ApplicationStatus;
