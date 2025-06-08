// Generate random ID
export const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    
    for (let i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
  };
  
  // Debounce function
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Throttle function
  export const throttle = (func, limit = 300) => {
    let inThrottle;
    
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  };
  
  // Parse query string to object
  export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      // Handle arrays in query params (e.g., filter[]=a&filter[]=b)
      if (key.endsWith('[]')) {
        const cleanKey = key.slice(0, -2);
        if (!result[cleanKey]) {
          result[cleanKey] = [];
        }
        result[cleanKey].push(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  };
  
  // Convert object to query string
  export const objectToQueryString = (obj) => {
    const params = new URLSearchParams();
    
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          params.append(`${key}[]`, item);
        });
      } else {
        // Always append the value, even if it's null
        params.append(key, value === null ? '' : value);
      }
    });
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };
  
  // Flatten object (for nested form data)
  export const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else {
        acc[pre + key] = obj[key];
      }
      
      return acc;
    }, {});
  };
  
  // Deep clone object
  export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  // Convert array to key-value object
  export const arrayToObject = (array, keyField) => {
    return array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});
  };
  
  // Group array by property
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  // Get days difference between two dates
  export const daysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Check if date is today
  export const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    return compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear();
  };
  
  // Get relative date description
  export const getRelativeDate = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    if (isToday(compareDate)) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (compareDate.getDate() === yesterday.getDate() &&
        compareDate.getMonth() === yesterday.getMonth() &&
        compareDate.getFullYear() === yesterday.getFullYear()) {
      return 'Yesterday';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (compareDate.getDate() === tomorrow.getDate() &&
        compareDate.getMonth() === tomorrow.getMonth() &&
        compareDate.getFullYear() === tomorrow.getFullYear()) {
      return 'Tomorrow';
    }
    
    return null; // Not a special date
  };
  
  // Convert text with line breaks to HTML
  export const textToHtml = (text) => {
    if (!text) return '';
    
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*?)(\n|$)/g, '<li>$1</li>');
  };
  
  // Parse text list to array
  export const parseTextList = (text) => {
    if (!text) return [];
    
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };
  
  // Extract initials from name
  export const getInitials = (name) => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };