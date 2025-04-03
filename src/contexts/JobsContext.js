import React, { createContext, useState, useEffect } from 'react';

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample job data
  const sampleJobs = [
    {
      id: 1,
      title: 'Sales Manager',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$2500 - $3000',
      experience: '3-5 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-15',
      deadline: '2025-04-15',
      daysRemaining: 4
    },
    {
      id: 2,
      title: 'Sales Coordinator',
      company: 'MyaCorp',
      location: 'Hanoi, Vietnam',
      type: 'Full Time',
      salary: '$1800 - $2200',
      experience: '1-3 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-20',
      deadline: '2025-04-20',
      daysRemaining: 9
    },
    {
      id: 3,
      title: 'Fashion Designer',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Remote',
      salary: '$2000 - $2800',
      experience: '2-4 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-25',
      deadline: '2025-04-25',
      daysRemaining: 14
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Contract Based',
      salary: '$1500 - $2000',
      experience: '1-2 Years',
      education: 'High School',
      postedDate: '2025-03-10',
      deadline: '2025-04-10',
      daysRemaining: 2
    },
    {
      id: 5,
      title: 'Retail Store Manager',
      company: 'MyaCorp',
      location: 'Danang, Vietnam',
      type: 'Full Time',
      salary: '$2800 - $3500',
      experience: '5-8 Years',
      education: 'Bachelor Degree',
      postedDate: '2025-03-05',
      deadline: '2025-04-05',
      daysRemaining: 1
    }
  ];

  // Fetch jobs (simulate API request)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set sample data
        setJobs(sampleJobs);
        
        // Initialize saved jobs and applications from localStorage if available
        const storedSavedJobs = localStorage.getItem('savedJobs');
        if (storedSavedJobs) {
          setSavedJobs(JSON.parse(storedSavedJobs));
        }
        
        const storedApplications = localStorage.getItem('applications');
        if (storedApplications) {
          setApplications(JSON.parse(storedApplications));
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Save/unsave job
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const isJobSaved = prev.includes(jobId);
      let newSavedJobs;
      
      if (isJobSaved) {
        // Remove job from saved jobs
        newSavedJobs = prev.filter(id => id !== jobId);
      } else {
        // Add job to saved jobs
        newSavedJobs = [...prev, jobId];
      }
      
      // Update localStorage
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      
      return newSavedJobs;
    });
  };

  // Check if a job is saved
  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };

  // Get job by ID
  const getJobById = (jobId) => {
    return jobs.find(job => job.id === parseInt(jobId)) || null;
  };

  // Get saved jobs
  const getSavedJobs = () => {
    return jobs.filter(job => savedJobs.includes(job.id));
  };

  // Submit job application
  const submitApplication = (applicationData) => {
    const newApplication = {
      id: Date.now(), // Generate a unique ID
      ...applicationData,
      status: 'Pending Review',
      appliedDate: new Date().toISOString()
    };
    
    setApplications(prev => {
      const newApplications = [...prev, newApplication];
      
      // Update localStorage
      localStorage.setItem('applications', JSON.stringify(newApplications));
      
      return newApplications;
    });
    
    return newApplication;
  };

  // Get user applications
  const getUserApplications = () => {
    return applications;
  };

  // Check if user has applied to a job
  const hasAppliedToJob = (jobId) => {
    return applications.some(app => app.jobId === parseInt(jobId));
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      toggleSaveJob,
      isJobSaved,
      getJobById,
      getSavedJobs,
      submitApplication,
      getUserApplications,
      hasAppliedToJob
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export default JobsContext;