import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { ABORT_ERROR_CODE } from '../constants/error';
import { handleApiError } from '../utils';

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: {
    code: string;
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public error?: { code: string }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public errors: z.ZodError) {
    super(message);
    this.name = 'ValidationError';
  }
}

interface ApiResponseWrapper<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.code === ABORT_ERROR_CODE) {
          throw error;
        }

        if (!error.response) {
          const networkError = new NetworkError('Network error occurred');
          handleApiError(networkError);
          throw networkError;
        }

        const { status, data } = error.response;
        const apiError = new ApiError(
          status,
          data?.message || 'An unexpected error occurred',
          data?.error
        );
        
        // Let handleApiError show the toast notification
        handleApiError(error);
        
        throw apiError;
      }
    );
  }

  private async validateResponse<T>(response: T, schema: z.ZodSchema): Promise<T> {
    try {
      return schema.parse(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError('Response validation failed', error);
        handleApiError(validationError);
        throw validationError;
      }
      throw error;
    }
  }

  async get<T>(
    url: string, 
    params?: Record<string, any>, 
    schema?: z.ZodSchema,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseWrapper<T>> {
    try {
      const response: AxiosResponse<ApiResponseWrapper<T>> = await this.client.get(url, { 
        params,
        ...config
      });
      if (schema) {
        await this.validateResponse(response.data.data, schema);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(
    url: string, 
    data?: any, 
    schema?: z.ZodSchema,
    config?: AxiosRequestConfig
  ): Promise<ApiResponseWrapper<T>> {
    try {
      const response: AxiosResponse<ApiResponseWrapper<T>> = await this.client.post(url, data, config);
      if (schema) {
        await this.validateResponse(response.data.data, schema);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data?: any, schema?: z.ZodSchema): Promise<ApiResponseWrapper<T>> {
    try {
      const response: AxiosResponse<ApiResponseWrapper<T>> = await this.client.put(url, data);
      if (schema) {
        await this.validateResponse(response.data.data, schema);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, schema?: z.ZodSchema): Promise<ApiResponseWrapper<T>> {
    try {
      const response: AxiosResponse<ApiResponseWrapper<T>> = await this.client.delete(url);
      if (schema) {
        await this.validateResponse(response.data.data, schema);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const api = new ApiService(); 