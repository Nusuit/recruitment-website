import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recruiterAPI } from '../../api/recruiter';

const JobForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: '',
    type: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    education: '',
    deadline: '',
    selectedSkills: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch skills
        const skillsResponse = await recruiterAPI.getSkills();
        setSkills(skillsResponse.skills);

        // If editing, fetch job details
        if (mode === 'edit' && id) {
          const jobResponse = await recruiterAPI.getJobDetail(id);
          const job = jobResponse.job;
          
          setFormData({
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            location: job.location,
            type: job.type,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            experience: job.experience,
            education: job.education,
            deadline: job.deadline.split('T')[0],
            selectedSkills: job.skills.map(s => s.id)
          });
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load form data. Please try again.');
        console.error('Error loading form data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const jobData = {
        ...formData,
        skills: formData.selectedSkills
      };

      if (mode === 'edit') {
        await recruiterAPI.updateJob(id, jobData);
      } else {
        await recruiterAPI.createJob(jobData);
      }

      navigate('/recruiter/jobs');
    } catch (err) {
      setError('Failed to save job. Please check your input and try again.');
      console.error('Error saving job:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="job-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Job Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          rows={5}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Job Type *</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            required
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salaryMin">Minimum Salary *</label>
          <input
            type="number"
            id="salaryMin"
            value={formData.salaryMin}
            onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salaryMax">Maximum Salary *</label>
          <input
            type="number"
            id="salaryMax"
            value={formData.salaryMax}
            onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="skills">Required Skills</label>
        <div className="skills-grid">
          {skills.map(skill => (
            <label key={skill.id} className="skill-checkbox">
              <input
                type="checkbox"
                checked={formData.selectedSkills.includes(skill.id)}
                onChange={(e) => {
                  const newSkills = e.target.checked
                    ? [...formData.selectedSkills, skill.id]
                    : formData.selectedSkills.filter(id => id !== skill.id);
                  setFormData({...formData, selectedSkills: newSkills});
                }}
              />
              {skill.name}
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => navigate('/recruiter/jobs')}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mode === 'edit' ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;