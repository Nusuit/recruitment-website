import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recruiterAPI } from '../../../api/recruiter';
import { formatDate, formatTime, formatApplicationStatus } from '../../../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faCalendar, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState';
import Modal from '../../../components/common/Modal';

const InterviewManagement = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const applicationId = searchParams.get('applicationId');

  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    location: '',
    interviewerName: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchApplications(); // Load applications first
        await fetchInterviews(); // Then load interviews
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails(applicationId);
    }
  }, [applicationId]);

  const fetchApplications = async () => {
    try {
      const response = await recruiterAPI.getAllApplications();
      console.log('Raw API Response:', response);
      
      // Handle different response structures
      let applications;
      if (response.payload?.content) {
        applications = response.payload.content;
      } else if (Array.isArray(response.payload)) {
        applications = response.payload;
      } else if (Array.isArray(response)) {
        applications = response;
      } else {
        applications = [];
      }

      // Log raw application data before processing
      console.log('Raw application data before processing:', applications);

      // Ensure each application has required fields
      applications = applications.map(app => {
        // Log individual application data
        console.log('Processing application:', app);
        
        // Extract job ID from various possible locations or generate one based on title
        let jobId = app.jobId || 
                   app.job?.jobId || 
                   app.job?.id || 
                   app.jobApplication?.jobId ||
                   app.jobApplication?.job?.id;

        // If no job ID exists, generate one based on job title
        if (!jobId) {
          const jobTitle = app.jobTitle || app.job?.title || app.jobApplication?.job?.title || 'Unknown Position';
          jobId = 1; // Default to 1 for Data Analytics position
        }
        
        console.log('Using job ID:', jobId);
        
        const processedApp = {
          ...app,
          jobId, // Ensure jobId is always present
          applicationId: app.applicationId || app.id || app.applicationId,
          job: {
            ...(app.job || {}),
            jobId: jobId,
            id: jobId, // Add both jobId and id for compatibility
            title: app.jobTitle || app.job?.title || app.jobApplication?.job?.title || 'Unknown Position',
            stages: app.stages || app.job?.stages || []
          },
          stages: app.stages || app.job?.stages || []
        };

        console.log('Processed application:', processedApp);
        return processedApp;
      });
      
      console.log('Final processed applications:', applications);
      setApplications(applications);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to fetch applications');
    }
  };

  const fetchApplicationDetails = async (id) => {
    try {
      const response = await recruiterAPI.getApplicationDetail(id);
      setSelectedApplication(response.payload);
    } catch (err) {
      console.error('Failed to fetch application details:', err);
      setError('Failed to fetch application details');
    }
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getInterviews();
      console.log('Raw interviews response:', response);
      
      // Transform the interview data to include all necessary fields
      const transformedInterviews = (response.payload.content || []).map(interview => {
        // Log the raw interview data to see its structure
        console.log('Raw interview data:', interview);

        // Validate required IDs
        if (!interview.jobId || !interview.stageId || !interview.scheduleId) {
          console.warn('Missing required IDs for interview:', {
            interviewId: interview.interviewId,
            jobId: interview.jobId,
            stageId: interview.stageId,
            scheduleId: interview.scheduleId
          });
        }

        return {
          ...interview,
          interviewId: interview.interviewId || interview.id,
          // No need to transform schedule info as it's already in the correct format from backend
        };
      });
      
      console.log('Transformed interviews:', transformedInterviews);
      setInterviews(transformedInterviews);
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
      setError('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplication) {
      setError('Please select a job application first');
      return;
    }

    console.log('Full selected application data:', selectedApplication);

    // Get job ID from the application structure
    const jobId = selectedApplication.jobId || 
                 selectedApplication.job?.jobId || 
                 selectedApplication.job?.id || 
                 1; // Default to 1 if no job ID exists

    console.log('Application data:', selectedApplication);
    console.log('Using job ID:', jobId);
    console.log('Job object:', selectedApplication.job);

    if (!formData.startTime) {
      setError('Please select interview date and time');
      return;
    }

    try {
      // Find the current PROGRESS interview to get its stage
      console.log('All interviews:', interviews);
      const progressInterview = interviews.find(interview => {
        console.log('Checking interview:', interview);
        return interview.status === 'PROGRESS' && 
               interview.applicationId === (selectedApplication.id || selectedApplication.applicationId);
      });

      console.log('Found progress interview:', progressInterview);

      if (!progressInterview) {
        setError('No interview in PROGRESS status found for this application');
        return;
      }

      const currentStage = progressInterview.stageId;
      
      // Check if this is the first stage
      if (progressInterview.stageName === 'CV Screening') {
        setError('Cannot schedule interview for CV Screening stage');
        return;
      }

      // Format the date to match backend's expected format (dd/MM/yyyy HH:mm:ss)
      const date = new Date(formData.startTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = '00';
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      
      const scheduleData = {
        name: formData.name || progressInterview.stageName,
        startTime: formattedDate,
        location: formData.location || 'District 7, HCM City',
        interviewerName: formData.interviewerName || 'Mr. Ngan Dan'
      };
      
      console.log('Selected application:', selectedApplication);
      console.log('Job ID:', jobId);
      console.log('Stage ID:', currentStage);
      console.log('Scheduling interview with data:', scheduleData);
      
      const response = await recruiterAPI.scheduleInterview(
        jobId,
        currentStage,
        scheduleData
      );
      
      console.log('Schedule interview response:', response);
      
      if (response.success) {
        await fetchInterviews(); // Refresh interviews list
        setShowScheduleModal(false);
        setFormData({
          name: '',
          startTime: '',
          location: '',
          interviewerName: '',
        });
        setSelectedApplication(null);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to schedule interview');
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setError(err.message || 'Failed to schedule interview. Please try again.');
    }
  };

  const handleUpdateStatus = async (jobId, stageId, scheduleId, interviewId, accept) => {
    try {
      console.log('Updating interview status with:', {
        jobId,
        stageId,
        scheduleId,
        interviewId,
        accept
      });

      // Find the current interview
      const interview = interviews.find(i => i.interviewId === interviewId);
      if (!interview) {
        throw new Error('Interview not found');
      }

      console.log('Found interview:', interview);

      // Validate required IDs - only jobId and stageId are required
      if (!interview.jobId || !interview.stageId) {
        setError('Missing required information. Please ensure job and stage details are available.');
        console.error('Missing required IDs:', {
          jobId: interview.jobId,
          stageId: interview.stageId,
          interviewId: interview.interviewId
        });
        return;
      }

      // Update the interview status
      await recruiterAPI.updateInterviewStatus(
        interview.jobId,
        interview.stageId,
        interview.scheduleId || null, // Make scheduleId optional
        interview.interviewId,
        accept
      );

      // Refresh the data
      await Promise.all([
        fetchApplications(),
        fetchInterviews()
      ]);

    } catch (err) {
      console.error('Error updating interview status:', err);
      setError(err.message || 'Failed to update interview status');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Interview Management</h1>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Schedule Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={faCalendar}
          title="No Interviews Scheduled"
          description="There are no interviews scheduled at the moment."
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interviews.map((interview) => {
                // Translate stage names to English
                let stageName = interview.stageName;
                if (stageName === 'Sàng lọc CV') {
                  stageName = 'CV Screening';
                } else if (stageName === 'Phỏng vấn kỹ thuật vòng 1') {
                  stageName = 'Technical Interview Round 1';
                } else if (stageName === 'Phỏng vấn kỹ thuật vòng 2') {
                  stageName = 'Technical Interview Round 2';
                } else if (stageName === 'Phỏng vấn với trưởng phòng') {
                  stageName = 'Manager Interview';
                } else if (stageName === 'Phỏng vấn với giám đốc') {
                  stageName = 'Director Interview';
                }

                return (
                  <tr key={interview.interviewId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {interview.candidateFullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {interview.candidateEmail || 'No email provided'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.jobTitle}</div>
                      <div className="text-sm text-gray-500">{interview.jobDepartment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stageName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(interview.scheduleStartTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(interview.scheduleStartTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.scheduleLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.interviewerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.status === 'PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        interview.status === 'PASSED' ? 'bg-green-100 text-green-800' :
                        interview.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {interview.status === 'PROGRESS' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(
                              interview.jobId,
                              interview.stageId,
                              interview.scheduleId,
                              interview.interviewId,
                              true
                            )}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Pass
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(
                              interview.jobId,
                              interview.stageId,
                              interview.scheduleId,
                              interview.interviewId,
                              false
                            )}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-1" /> Fail
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Interview"
      >
        <div className="space-y-4">
          {!applicationId && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Job Application</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedApplication?.applicationId || ''}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  console.log('Selected value:', selectedValue);
                  console.log('Current applications:', applications);
                  
                  if (!selectedValue) {
                    setSelectedApplication(null);
                    setError(null);
                    return;
                  }

                  // Find the selected application
                  const selected = applications.find(app => {
                    // Handle both string and number IDs
                    const appId = app.applicationId?.toString() || '';
                    const selectedId = selectedValue?.toString() || '';
                    return appId === selectedId;
                  });
                  
                  console.log('Found selected application:', selected);
                  
                  if (selected) {
                    // Check if we have either a job title or job ID
                    if (!selected.job?.title && !selected.jobTitle) {
                      console.warn('Selected application has no job information:', selected);
                      setError('This application has invalid job information. Please contact support.');
                      return;
                    }
                    setSelectedApplication(selected);
                    setError(null);
                  } else {
                    console.warn('No application found for ID:', selectedValue);
                    setError('Could not find the selected application. Please try again.');
                  }
                }}
              >
                <option key="default" value="">Select a job application</option>
                {applications.map((app) => {
                  const jobTitle = app.job?.title || app.jobTitle || 'Unknown Position';
                  const candidateName = app.candidateName || app.candidateFullName || 'Anonymous';
                  return (
                    <option key={app.applicationId} value={app.applicationId}>
                      {jobTitle} - {candidateName}
                    </option>
                  );
                })}
              </select>
              
              {selectedApplication && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Application Details:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Position:</span> {selectedApplication.job?.title || selectedApplication.jobTitle || 'N/A'}</p>
                    <p><span className="font-medium">Candidate:</span> {selectedApplication.candidateFullName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedApplication.candidateEmail || 'N/A'}</p>
                    <p><span className="font-medium">Status:</span> {selectedApplication.status || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Interview Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Technical Interview, HR Interview"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Meeting Room 1, Online via Zoom"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interviewer Name</label>
            <input
              type="text"
              name="interviewerName"
              value={formData.interviewerName}
              onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
              placeholder="Enter interviewer's name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={handleScheduleInterview}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Schedule Interview
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewManagement;
