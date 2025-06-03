import type { ErrorMapping, ErrorCode } from "../types/api.types";

export const ERROR_MAPPINGS: Record<ErrorCode, ErrorMapping> = {
    NOT_FOUND: {
      message: 'The requested resource was not found',
      toastType: 'error',
      code: 'NOT_FOUND'
    },
    VALIDATION_ERROR: {
      message: 'Please check your input and try again',
      toastType: 'error',
      code: 'VALIDATION_ERROR'
    },
    INTERNAL_ERROR: {
      message: 'Something went wrong. Please try again later',
      toastType: 'error',
      code: 'INTERNAL_ERROR'
    },
    UNAUTHORIZED: {
      message: 'Please sign in to continue',
      toastType: 'error',
      code: 'UNAUTHORIZED'
    },
    FORBIDDEN: {
      message: 'You do not have permission to perform this action',
      toastType: 'error',
      code: 'FORBIDDEN'
    }
  };

  export const ABORT_ERROR_CODE = 'ERR_CANCELED'