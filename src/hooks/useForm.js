import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: inputValue
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle blur events for field validation
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate single field if validation function provided
    if (validate) {
      const fieldErrors = validate(values);
      setErrors({
        ...errors,
        [name]: fieldErrors[name] || ''
      });
    }
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  // Validate all fields
  const validateForm = () => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    // Form is valid if no errors
    return Object.keys(formErrors).length === 0;
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    validateForm,
    setValues,
    setErrors
  };
};

export default useForm;