import React from 'react';
import { Link } from 'react-router-dom';
import JobCard from './JobCard';

const JobList = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;