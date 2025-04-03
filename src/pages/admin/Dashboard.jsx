import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import JobsContext from '../../contexts/JobsContext';
import SavedJobs from '../../components/jobs/SavedJobs';
import ApplicationsList from '../../components/applicant/ApplicationsList';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { getUserApplications, getSavedJobs, getRecommendedJobs, loading } = useContext(JobsContext);
  
  const [stats, setStats] = useState({
    applications: 0,
    pendingApplications: 0,
    interviews: 0,
    savedJobs: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (loading) return;
      
      setIsLoading(true);
      
      try {
        // Get data from JobsContext
        const applications = getUserApplications();
        const savedJobs = getSavedJobs();
        const recommended = getRecommendedJobs ? getRecommendedJobs() : [];
        
        // Calculate stats
        const pending = applications.filter(app => 
          app.status === 'Pending Review' || app.status === 'Shortlisted'
        ).length;
        
        const interviews = applications.filter(app => 
          app.status === 'Interview Scheduled'
        ).length;
        
        setStats({
          applications: applications.length,
          pendingApplications: pending,
          interviews: interviews,
          savedJobs: savedJobs.length
        });
        
        // Get recent activity
        const activity = [
          ...applications.map(app => ({
            type: 'application',
            id: app.id,
            jobTitle: app.jobTitle,
            date: app.appliedDate,
            status: app.status
          }))
        ];
        
        // Sort by date descending
        activity.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setRecentActivity(activity.slice(0, 5)); // Get latest 5 activities
        
        // Set recommended jobs
        setRecommendedJobs(recommended.slice(0, 3)); // Top 3 recommendations
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [loading, getUserApplications, getSavedJobs, getRecommendedJobs]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sample recommended jobs for when no real recommendations available
  const sampleRecommendedJobs = [
    {
      id: 1,
      title: 'Fashion Designer',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$2500 - $3500',
      matchScore: 95
    },
    {
      id: 2,
      title: 'Visual Merchandiser',
      company: 'MyaCorp',
      location: 'HCM, Vietnam',
      type: 'Full Time',
      salary: '$2000 - $2800',
      matchScore: 88
    },
    {
      id: 3,
      title: 'Fashion Marketing Specialist',
      company: 'MyaCorp',
      location: 'Remote',
      type: 'Full Time',
      salary: '$2200 - $3000',
      matchScore: 82
    }
  ];

  // Use sample data if no real recommendations available
  const displayRecommendedJobs = recommendedJobs.length > 0 ? 
    recommendedJobs : sampleRecommendedJobs;

  if (isLoading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  return (
    <div className="applicant-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-message">
          Welcome back, {user?.firstName || 'there'}! Here's your job application summary.
        </p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon applications-icon"></div>
          <div className="stat-content">
            <h2>{stats.applications}</h2>
            <p>Total Applications</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon"></div>
          <div className="stat-content">
            <h2>{stats.pendingApplications}</h2>
            <p>Pending Applications</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon interviews-icon"></div>
          <div className="stat-content">
            <h2>{stats.interviews}</h2>
            <p>Interviews</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon saved-icon"></div>
          <div className="stat-content">
            <h2>{stats.savedJobs}</h2>
            <p>Saved Jobs</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Job Recommendations</h2>
            <Link to="/applicant/jobs" className="view-all-link">Browse All Jobs</Link>
          </div>
          
          <div className="recommended-jobs">
            {displayRecommendedJobs.map(job => (
              <div key={job.id} className="recommended-job-card">
                <div className="job-match-score">
                  <div className="score-badge">{job.matchScore}%</div>
                  <span>Match</span>
                </div>
                
                <div className="job-details">
                  <h3 className="job-title">
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  </h3>
                  
                  <div className="job-meta">
                    <span className="company-name">{job.company}</span>
                    <span className="job-location">
                      <i className="location-icon"></i>
                      {job.location}
                    </span>
                    <span className="job-type">{job.type}</span>
                  </div>
                  
                  <div className="job-salary">
                    <i className="salary-icon"></i>
                    <span>{job.salary}</span>
                  </div>
                </div>
                
                <div className="job-actions">
                  <Link to={`/jobs/${job.id}`} className="view-job-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Applications</h2>
            <Link to="/applicant/applications" className="view-all-link">View All</Link>
          </div>
          
          <div className="recent-applications">
            <ApplicationsList limit={3} showViewAll={false} />
          </div>
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Saved Jobs</h2>
            <Link to="/applicant/saved-jobs" className="view-all-link">View All</Link>
          </div>
          
          <div className="saved-jobs">
            <SavedJobs limit={3} showViewAll={false} />
          </div>
        </div>
      </div>
      
      <div className="dashboard-activity">
        <div className="section-header">
          <h2>Recent Activity</h2>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="empty-state">
            <p>No recent activity to show.</p>
            <Link to="/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="activity-timeline">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-date">
                  {formatDate(activity.date)}
                </div>
                <div className="activity-indicator"></div>
                <div className="activity-content">
                  {activity.type === 'application' && (
                    <div className="activity-application">
                      <p>
                        You applied for <strong>{activity.jobTitle}</strong>
                      </p>
                      <span className={`status-badge ${activity.status.toLowerCase().replace(' ', '-')}`}>
                        {activity.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="dashboard-tips">
        <h2>Job Search Tips</h2>
        <div className="tips-container">
          <div className="tip-card">
            <div className="tip-icon resume-icon"></div>
            <h3>Update Your Resume</h3>
            <p>Keep your resume current with your latest skills and experiences.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon interview-icon"></div>
            <h3>Prepare for Interviews</h3>
            <p>Research the company and practice answering common interview questions.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon network-icon"></div>
            <h3>Network</h3>
            <p>Connect with professionals in your field to discover new opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;