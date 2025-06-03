import { z } from 'zod';

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
  });

export type ErrorCode = 
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN';

export interface ErrorMapping {
  message: string;
  toastType: 'error' | 'success';
  code: ErrorCode;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: {
    code: string;
  };
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}