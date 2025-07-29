/**
 * Date utility functions for exam date handling
 */

export interface DateValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Converts date from DD/MM/YYYY to YYYY-MM-DD format
 */
export const convertToISODate = (dateString: string): string => {
  if (!dateString) return '';
  
  // If already in YYYY-MM-DD format, return as is
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    return dateString;
  }
  
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

/**
 * Converts date from YYYY-MM-DD to DD/MM/YYYY format
 */
export const convertToDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes('/')) {
    return dateString;
  }
  
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Validates if a date is valid for exam selection
 */
export const validateExamDate = (dateString: string): DateValidationResult => {
  if (!dateString) {
    return { valid: false, message: "Date is required" };
  }

  const [day, month, year] = dateString.split('/');
  const examDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(examDate.getTime())) {
    return { valid: false, message: "Invalid date format" };
  }
  
  // Check if date is in the past
  if (examDate < today) {
    return { valid: false, message: "Cannot select past dates" };
  }
  
  // Check if date is too far in the future (90 days)
  const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
  if (examDate > maxDate) {
    return { valid: false, message: "Cannot select dates more than 90 days in the future" };
  }
  
  return { valid: true };
};

/**
 * Formats date for display in a user-friendly format
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    let isoDate = dateString;
    
    // Convert DD/MM/YYYY to YYYY-MM-DD if needed
    if (dateString.includes('/')) {
      isoDate = convertToISODate(dateString);
    }
    
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

/**
 * Checks if a date is today
 */
export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const today = new Date();
  let examDate: Date;
  
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    examDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    examDate = new Date(dateString);
  }
  
  return examDate.toDateString() === today.toDateString();
};

/**
 * Gets the number of days until a given date
 */
export const getDaysUntil = (dateString: string): number => {
  if (!dateString) return 0;
  
  let examDate: Date;
  
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    examDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    examDate = new Date(dateString);
  }
  
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}; 