import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateJobPostingForm } from '../../utils/validators';
import { createJob, getJobById, updateJob } from '../../api/jobs';

const JobPostingForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Initial form state
  const initialFormState = {
    title: '',
    department: '',
    location: '',
    type: 'Full Time',
    experience: '',
    education: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    noOfVacancies: 1,
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    skills: '',
    status: 'active'
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  
  // Job types options
  const jobTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Remote',
    'Internship',
    'Temporary'
  ];
  
  // Education levels
  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate',
    'No Specific Requirement'
  ];
  
  // Fetch job data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchJobDetails = async () => {
        try {
          setIsLoading(true);
          
          const response = await getJobById(id);
          
          if (response.success) {
            setFormData(response.job);
          } else {
            setErrors({ submit: response.error });
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching job details:', error);
          setErrors({ submit: 'Failed to fetch job details' });
          setIsLoading(false);
        }
      };
      
      fetchJobDetails();
    }
  }, [isEditing, id]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle text area inputs with line breaks
  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateJobPostingForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (isEditing) {
        response = await updateJob(id, formData);
      } else {
        response = await createJob(formData);
      }
      
      if (response.success) {
        // Navigate back to jobs management
        navigate('/admin/jobs', { 
          state: { 
            success: true, 
            message: isEditing ? 'Job updated successfully' : 'Job created successfully' 
          } 
        });
      } else {
        setErrors({ submit: response.error });
      }
    } catch (error) {
      console.error('Error submitting job:', error);
      setErrors({
        submit: 'Failed to submit job. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading-container">Loading job details...</div>;
  }
  
  return (
    <div className="job-posting-form">
      <div className="form-container">
        <h1>{isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}</h1>
        
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit}>
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
                  placeholder="e.g. Fashion Designer"
                />
                {errors.title && <div className="field-error">{errors.title}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Design"
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
                  placeholder="e.g. HCM, Vietnam"
                />
                {errors.location && <div className="field-error">{errors.location}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Job Type*</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Experience Required*</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2-4 Years"
                />
                {errors.experience && <div className="field-error">{errors.experience}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="education">Education Level</label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                >
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryMin">Minimum Salary (Monthly)</label>
                <div className="input-prefix">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="e.g. 2000"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="salaryMax">Maximum Salary (Monthly)</label>
                <div className="input-prefix">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="e.g. 2800"
                    min="0"
                  />
                </div>
                {errors.salaryMax && <div className="field-error">{errors.salaryMax}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deadline">Application Deadline*</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.deadline && <div className="field-error">{errors.deadline}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="noOfVacancies">Number of Vacancies</label>
                <input
                  type="number"
                  id="noOfVacancies"
                  name="noOfVacancies"
                  value={formData.noOfVacancies}
                  onChange={handleChange}
                  min="1"
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
                onChange={handleTextAreaChange}
                rows="5"
                placeholder="Describe the job role and responsibilities"
              ></textarea>
              {errors.description && <div className="field-error">{errors.description}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="responsibilities">Responsibilities*</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleTextAreaChange}
                rows="5"
                placeholder="List the key responsibilities (one per line)"
              ></textarea>
              {errors.responsibilities && <div className="field-error">{errors.responsibilities}</div>}
              <div className="form-tip">Enter each responsibility on a new line, starting with a dash (-)</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="requirements">Requirements*</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleTextAreaChange}
                rows="5"
                placeholder="List the job requirements (one per line)"
              ></textarea>
              {errors.requirements && <div className="field-error">{errors.requirements}</div>}
              <div className="form-tip">Enter each requirement on a new line, starting with a dash (-)</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="benefits">Benefits</label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleTextAreaChange}
                rows="5"
                placeholder="List the benefits offered (one per line)"
              ></textarea>
              <div className="form-tip">Enter each benefit on a new line, starting with a dash (-)</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="skills">Required Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Fashion Design, Adobe Illustrator, Sketching"
              />
              <div className="form-tip">Separate skills with commas</div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Publishing Settings</h2>
            
            <div className="form-group">
              <label htmlFor="status">Job Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Save as Draft</option>
              </select>
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
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                (isEditing ? 'Updating...' : 'Creating...') : 
                (isEditing ? 'Update Job' : 'Create Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobPostingForm;