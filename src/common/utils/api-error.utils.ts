import { toast } from 'react-hot-toast';
import { ERROR_MAPPINGS } from '../constants/error.constants';
import type { ErrorCode } from '../types/api.types';

export const handleApiError = (error: any): void => {
  // Check if it's an API error with our expected structure
  if (error?.response?.data?.error?.code) {
    const code = error.response.data.error.code as ErrorCode;
    const mapping = ERROR_MAPPINGS[code];
    
    if (mapping) {
      // For validation errors, show API message if available
      if (code === ERROR_MAPPINGS.VALIDATION_ERROR.code && error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      
      toast[mapping.toastType](mapping.message);
      return;
    }
  }

  // Fallback for unexpected errors
  toast.error('An unexpected error occurred. Please try again.');
}; 