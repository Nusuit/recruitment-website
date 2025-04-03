/**
 * Utility functions for client-side form validation
 */

// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password validation (at least 8 chars, 1 letter, 1 number)
  export const isValidPassword = (password) => {
    return password.length >= 8 && 
           /[A-Za-z]/.test(password) && 
           /\d/.test(password);
  };
  
  // Phone number validation
  export const isValidPhone = (phone) => {
    // Basic international format check
    const phoneRegex = /^\+?[\d\s\-()]{8,20}$/;
    return phoneRegex.test(phone);
  };
  
  // URL validation
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Required field validation
  export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };
  
  // Min/max length validation
  export const hasMinLength = (value, minLength) => {
    return value && value.length >= minLength;
  };
  
  export const hasMaxLength = (value, maxLength) => {
    return value && value.length <= maxLength;
  };
  
  // Numeric value validation
  export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  export const isPositiveNumber = (value) => {
    return isNumeric(value) && parseFloat(value) > 0;
  };
  
  // Date validation
  export const isPastDate = (date) => {
    return new Date(date) < new Date();
  };
  
  export const isFutureDate = (date) => {
    return new Date(date) > new Date();
  };
  
  // File type validation
  export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  };
  
  // File size validation
  export const isValidFileSize = (file, maxSizeInBytes) => {
    return file.size <= maxSizeInBytes;
  };
  
  /**
   * Form validation functions for specific forms
   */
  
  // Login form validation
  export const validateLoginForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isNotEmpty(values.password)) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };
  
  // Signup form validation
  export const validateSignupForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.firstName)) {
      errors.firstName = 'First name is required';
    }
    
    if (!isNotEmpty(values.lastName)) {
      errors.lastName = 'Last name is required';
    }
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isNotEmpty(values.password)) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters with letters and numbers';
    }
    
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    return errors;
  };
  
  // Forgot password form validation
  export const validateForgotPasswordForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    return errors;
  };
  
  // Reset password form validation
  export const validateResetPasswordForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.password)) {
      errors.password = 'New password is required';
    } else if (!isValidPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters with letters and numbers';
    }
    
    if (!isNotEmpty(values.confirmPassword)) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  // Profile form validation
  export const validateProfileForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.firstName)) {
      errors.firstName = 'First name is required';
    }
    
    if (!isNotEmpty(values.lastName)) {
      errors.lastName = 'Last name is required';
    }
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (values.phone && !isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (values.website && !isValidUrl(values.website)) {
      errors.website = 'Invalid website URL';
    }
    
    return errors;
  };
  
  // Job application form validation
  export const validateApplicationForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.firstName)) {
      errors.firstName = 'First name is required';
    }
    
    if (!isNotEmpty(values.lastName)) {
      errors.lastName = 'Last name is required';
    }
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isNotEmpty(values.phone)) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(values.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    
    if (!values.resume) {
      errors.resume = 'Resume is required';
    } else if (values.resume && !isValidFileType(values.resume, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])) {
      errors.resume = 'Resume must be a PDF or Word document';
    } else if (values.resume && !isValidFileSize(values.resume, 5 * 1024 * 1024)) { // 5MB max
      errors.resume = 'Resume file size must be less than 5MB';
    }
    
    return errors;
  };
  
  // Job posting form validation
  export const validateJobPostingForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.title)) {
      errors.title = 'Job title is required';
    }
    
    if (!isNotEmpty(values.department)) {
      errors.department = 'Department is required';
    }
    
    if (!isNotEmpty(values.location)) {
      errors.location = 'Location is required';
    }
    
    if (!isNotEmpty(values.type)) {
      errors.type = 'Job type is required';
    }
    
    if (!isNotEmpty(values.experience)) {
      errors.experience = 'Experience requirement is required';
    }
    
    if (!isNotEmpty(values.description)) {
      errors.description = 'Job description is required';
    }
    
    if (!isNotEmpty(values.responsibilities)) {
      errors.responsibilities = 'Responsibilities are required';
    }
    
    if (!isNotEmpty(values.requirements)) {
      errors.requirements = 'Requirements are required';
    }
    
    if (values.salaryMin && values.salaryMax && 
        parseInt(values.salaryMin) > parseInt(values.salaryMax)) {
      errors.salaryMax = 'Maximum salary should be greater than minimum salary';
    }
    
    if (!values.deadline) {
      errors.deadline = 'Application deadline is required';
    } else if (!isFutureDate(values.deadline)) {
      errors.deadline = 'Deadline must be a future date';
    }
    
    if (!isPositiveNumber(values.noOfVacancies)) {
      errors.noOfVacancies = 'Number of vacancies must be a positive number';
    }
    
    return errors;
  };
  
  // Contact form validation
  export const validateContactForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.firstName)) {
      errors.firstName = 'First name is required';
    }
    
    if (!isNotEmpty(values.lastName)) {
      errors.lastName = 'Last name is required';
    }
    
    if (!isNotEmpty(values.email)) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isNotEmpty(values.message)) {
      errors.message = 'Message is required';
    } else if (!hasMinLength(values.message, 10)) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };
  
  // Interview scheduling form validation
  export const validateInterviewForm = (values) => {
    const errors = {};
    
    if (!isNotEmpty(values.date)) {
      errors.date = 'Interview date is required';
    } else if (!isFutureDate(values.date)) {
      errors.date = 'Interview date must be in the future';
    }
    
    if (!isNotEmpty(values.time)) {
      errors.time = 'Interview time is required';
    }
    
    if (!isNotEmpty(values.type)) {
      errors.type = 'Interview type is required';
    }
    
    if (values.type === 'in-person' && !isNotEmpty(values.location)) {
      errors.location = 'Interview location is required';
    }
    
    if (values.type === 'online' && !isNotEmpty(values.platform)) {
      errors.platform = 'Interview platform is required';
    }
    
    if (values.type === 'online' && !isNotEmpty(values.link)) {
      errors.link = 'Meeting link is required';
    } else if (values.type === 'online' && values.link && !isValidUrl(values.link)) {
      errors.link = 'Invalid meeting link';
    }
    
    return errors;
  };
  
  // Export all validators
  export default {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidUrl,
    isNotEmpty,
    hasMinLength,
    hasMaxLength,
    isNumeric,
    isPositiveNumber,
    isPastDate,
    isFutureDate,
    isValidFileType,
    isValidFileSize,
    validateLoginForm,
    validateSignupForm,
    validateForgotPasswordForm,
    validateResetPasswordForm,
    validateProfileForm,
    validateApplicationForm,
    validateJobPostingForm,
    validateContactForm,
    validateInterviewForm
  };