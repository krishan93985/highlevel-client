import { toast } from 'react-hot-toast';
import { ERROR_MAPPINGS } from '../constants/error';
import type { ErrorCode } from '../types/api.types';

export const handleApiError = (error: any): void => {
  // Check if it's an API error with our expected structure
  if (error?.response?.data?.error?.code) {
    const code = error.response.data.error.code as ErrorCode;
    const mapping = ERROR_MAPPINGS[code];
    
    if (mapping) {
      toast[mapping.toastType](mapping.message);
      return;
    }
  }

  // Fallback for unexpected errors
  toast.error('An unexpected error occurred. Please try again.');
}; 