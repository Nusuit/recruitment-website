import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruiterAPI } from '../../../api/recruiter';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'FULL_TIME',
    description: '',
    requirements: '',
    benefits: '',
    salaryMin: '',
    salaryMax: '',
    experienceLevel: '',
    educationLevel: '',
    deadline: '',
    status: 'DRAFT',
    selectedSkills: []
  });

  // Fetch available skills when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await recruiterAPI.getSkills();
        setSkills(response.skills);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again.');
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skillId) => {
    setFormData(prev => {
      const selectedSkills = prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...prev.selectedSkills, skillId];
      
      return {
        ...prev,
        selectedSkills
      };
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'title', 'department', 'location', 'type',
      'description', 'requirements', 'salaryMin',
      'salaryMax', 'deadline'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.selectedSkills.length === 0) {
      setError('Please select at least one required skill');
      return false;
    }

    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      setError('Minimum salary cannot be greater than maximum salary');
      return false;
    }

    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    if (deadlineDate < today) {
      setError('Deadline cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await recruiterAPI.createJob({
        ...formData,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax)
      });

      // Update skills for the newly created job
      await recruiterAPI.updateJobSkills(response.job.id, formData.selectedSkills);

      navigate('/admin/jobs', {
        state: { 
          success: true,
          message: 'Job posted successfully!'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to create job. Please try again.');
      console.error('Error creating job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setLoading(true);
      setError(null);

      await recruiterAPI.createJob({
        ...formData,
        status: 'DRAFT',
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax)
      });

      navigate('/admin/jobs', {
        state: { 
          success: true,
          message: 'Job saved as draft!'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to save draft. Please try again.');
      console.error('Error saving draft:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-job-page">
      <div className="page-header">
        <h1>Create New Job</h1>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Job Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department*</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Employment Type*</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">Minimum Salary*</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">Maximum Salary*</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Job Details</h2>
          
          <div className="form-group">
            <label htmlFor="description">Job Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements*</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="benefits">Benefits</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Qualifications</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select Experience Level</option>
                <option value="ENTRY">Entry Level</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="educationLevel">Education Level</label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <option value="">Select Education Level</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="ASSOCIATE">Associate Degree</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
                <option value="DOCTORATE">Doctorate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills*</label>
            <div className="skills-grid">
              {skills.map(skill => (
                <label key={skill.id} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.selectedSkills.includes(skill.id)}
                    onChange={() => handleSkillChange(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Posting Details</h2>
          
          <div className="form-group">
            <label htmlFor="deadline">Application Deadline*</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/jobs')}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="draft-btn"
            onClick={handleSaveAsDraft}
            disabled={loading}
          >
            Save as Draft
          </button>

          <button 
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPage;