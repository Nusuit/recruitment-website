import { useContext } from 'react';
import JobsContext from '../contexts/JobsContext';

const useJobs = () => {
  const context = useContext(JobsContext);
  
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  
  return context;
};

export default useJobs;