import type { ErrorMapping, ErrorCode } from "../types/api.types";

export const ERROR_MAPPINGS: Record<ErrorCode, ErrorMapping> = {
    NOT_FOUND: {
      message: 'The requested resource was not found',
      toastType: 'error'
    },
    VALIDATION_ERROR: {
      message: 'Please check your input and try again',
      toastType: 'error'
    },
    INTERNAL_ERROR: {
      message: 'Something went wrong. Please try again later',
      toastType: 'error'
    },
    UNAUTHORIZED: {
      message: 'Please sign in to continue',
      toastType: 'error'
    },
    FORBIDDEN: {
      message: 'You do not have permission to perform this action',
      toastType: 'error'
    }
  };

  export const ABORT_ERROR_CODE = 'ERR_CANCELED'