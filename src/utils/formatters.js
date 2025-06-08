// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (dateString, options = {}) => {
    if (!dateString) {
      return "N/A";
    }

    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    let formattedDateString = dateString;
    // Regex to match ISO 8601 with fractional seconds and capture up to milliseconds
    // Example: "2025-06-07T22:41:18.576993" -> "2025-06-07T22:41:18.576"
    const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\d*/;
    const match = dateString.toString().match(regex);

    if (match && match[1]) {
      formattedDateString = match[1];
    }

    const date = new Date(formattedDateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString('en-US', mergedOptions);
  };
  
  // Format date range
  export const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate, { month: 'short', year: 'numeric' });
    const end = endDate ? formatDate(endDate, { month: 'short', year: 'numeric' }) : 'Present';
    
    return `${start} - ${end}`;
  };
  
  // Format time
  export const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format datetime
  export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    
    return `${formatDate(date)} at ${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };
  
  // Format phone number
  export const formatPhoneNumber = (phoneNumber) => {
    // Format for US phone numbers (adjust as needed)
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
    }
    
    return phoneNumber; // Return original if doesn't match expected format
  };
  
  // Format number with commas
  export const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Format percentage
  export const formatPercentage = (value, decimals = 0) => {
    return `${(value * 100).toFixed(decimals)}%`;
  };
  
  // Format file size
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format time ago
  export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) {
      return 'just now';
    }
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    }
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    }
    
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }
    
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
      return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    }
    
    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
  };

  // NEW: formatRelativeTime function
  export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
        return "just now";
    } else if (diffSeconds < 3600) { // less than an hour
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) { // less than a day
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 2592000) { // less than 30 days (approx a month)
        const days = Math.floor(diffSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 31536000) { // less than a year
        const months = Math.floor(diffSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };
  
  // Format salary range
  export const formatSalaryRange = (min, max, period = 'monthly') => {
    if (!min && !max) return 'Negotiable';
    
    if (!min) return `Up to ${formatCurrency(max)} ${period}`;
    if (!max) return `From ${formatCurrency(min)} ${period}`;
    
    return `${formatCurrency(min)} - ${formatCurrency(max)} ${period}`;
  };
  
  // Format job type
  export const formatJobType = (type) => {
    switch (type.toLowerCase()) {
      case 'full_time':
      case 'full-time':
        return 'Full Time';
      case 'part_time':
      case 'part-time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      case 'remote':
        return 'Remote';
      case 'temporary':
        return 'Temporary';
      default:
        return type;
    }
  };
  
  // Format application status
  export const formatApplicationStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending_review':
        return 'Pending Review';
      case 'in_review':
      case 'reviewing':
        return 'In Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview':
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer':
      case 'offered':
        return 'Offer Extended';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
