/**
 * Utility functions for client-side form validation
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

// Password validation (minimum 8 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 3; 
};

// Phone number validation
export const isValidPhone = (phone) => {
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
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
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

export const isInteger = (value) => {
    return Number.isInteger(Number(value)) && String(value).indexOf('.') === -1;
}

// Date validation
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0,0,0,0);
  return date < today;
};

export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0,0,0,0);
  return date > today;
};

export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// File type validation
export const isValidFileType = (file, allowedTypes) => {
  return file && allowedTypes.includes(file.type);
};

// File size validation
export const isValidFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file && file.size <= maxSizeInBytes;
};

/**
 * Form validation functions for specific forms
 */

// Login form validation
export const validateLoginForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Login Form with values:", values);

  if (!isNotEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isNotEmpty(values.password)) {
    errors.password = 'Password is required';
  }
  console.log("[Validator] Login Form Validation Errors:", errors);
  return errors;
};

// Signup form validation
export const validateSignupForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Signup Form with values:", values);

  if (!isNotEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!isNotEmpty(values.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters.'; 
  }

  if (!isNotEmpty(values.confirmPassword)) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  console.log("[Validator] Signup Form Validation Errors:", errors);
  return errors;
};

// Forgot password form validation
export const validateForgotPasswordForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Forgot Password Form:", values);
  if (!isNotEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  console.log("[Validator] Forgot Password Errors:", errors);
  return errors;
};

// Reset password form validation
export const validateResetPasswordForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Reset Password Form:", values);
  if (!isNotEmpty(values.password)) {
    errors.password = 'New password is required';
  } else if (!isValidPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters.'; 
  }

  if (!isNotEmpty(values.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  console.log("[Validator] Reset Password Errors:", errors);
  return errors;
};

// Profile form validation (Ví dụ mẫu)
export const validateProfileForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Profile Form:", values);

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
  if (values.bio && !hasMaxLength(values.bio, 500)) {
    errors.bio = 'Bio should not exceed 500 characters.';
  }
  // ... thêm các rule khác cho address, companyName (nếu là recruiter profile), etc.
  console.log("[Validator] Profile Form Errors:", errors);
  return errors;
};

// Job application form validation (Ví dụ mẫu)
export const validateApplicationForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Application Form:", values);

  if (!isNotEmpty(values.fullName)) {
    errors.fullName = 'Full name is required';
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
  } else if (values.resume && !isValidFileSize(values.resume, 5)) {
    errors.resume = 'Resume file size must be less than 5MB';
  }
  if (values.coverLetter && !hasMaxLength(values.coverLetter, 2000)) {
    errors.coverLetter = 'Cover letter should not exceed 2000 characters.';
  }
  if (values.expectedSalary && !isPositiveNumber(values.expectedSalary)) {
      errors.expectedSalary = 'Expected salary must be a positive number.';
  }
  console.log("[Validator] Application Form Errors:", errors);
  return errors;
};

// Job posting form validation (Ví dụ mẫu)
export const validateJobPostingForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Job Posting Form:", values);

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
  if (!isNotEmpty(values.description)) {
    errors.description = 'Job description is required';
  }
  if (!isNotEmpty(values.requirements)) {
    errors.requirements = 'Requirements are required';
  }
  if (!isNotEmpty(values.benefits)) {
    errors.benefits = 'Benefits are required';
  }
  if (!isNotEmpty(values.salaryMin)) {
    errors.salaryMin = 'Minimum salary is required';
  }
  if (!isNotEmpty(values.salaryMax)) {
    errors.salaryMax = 'Maximum salary is required';
  }
  if (!isNotEmpty(values.deadline)) {
    errors.deadline = 'Application deadline is required';
  }
  if (!isNotEmpty(values.educationLevel)) {
    errors.educationLevel = 'Education level is required';
  }
  if (!isNotEmpty(values.experienceLevel)) {
    errors.experienceLevel = 'Experience level is required';
  }
  if (!isNotEmpty(values.status)) {
    errors.status = 'Job status is required';
  }

  console.log("[Validator] Job Posting Form Errors:", errors);
  return errors;
};

// Contact form validation (Ví dụ mẫu)
export const validateContactForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Contact Form:", values);

  if (!isNotEmpty(values.name)) {
    errors.name = 'Name is required';
  }
  if (!isNotEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email format';
  }
  if (!isNotEmpty(values.message)) {
    errors.message = 'Message is required';
  } else if (!hasMaxLength(values.message, 1000)) {
    errors.message = 'Message should not exceed 1000 characters.';
  }

  console.log("[Validator] Contact Form Errors:", errors);
  return errors;
};

// Interview scheduling form validation (Ví dụ mẫu)
export const validateInterviewForm = (values) => {
  const errors = {};
  console.log("[Validator] Validating Interview Form:", values);

  if (!isNotEmpty(values.interviewDate)) {
    errors.interviewDate = 'Interview date is required';
  } else if (!isValidDate(values.interviewDate) || !isFutureDate(values.interviewDate)) {
    errors.interviewDate = 'Interview date must be a valid future date.';
  }
  if (!isNotEmpty(values.interviewTime)) {
    errors.interviewTime = 'Interview time is required';
  }
  if (!isNotEmpty(values.interviewType)) {
    errors.interviewType = 'Interview type is required';
  }

  if (values.interviewType === 'in-person' && !isNotEmpty(values.location)) {
    errors.location = 'Location is required for in-person interviews.';
  }
  if (values.interviewType === 'online' && !isNotEmpty(values.meetingLink)) {
    errors.meetingLink = 'Meeting link is required for online interviews.';
  } else if (values.interviewType === 'online' && values.meetingLink && !isValidUrl(values.meetingLink)) {
    errors.meetingLink = 'Invalid meeting link format.';
  }

  console.log("[Validator] Interview Form Errors:", errors);
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
  isInteger,
  isPastDate,
  isFutureDate,
  isValidDate,
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
