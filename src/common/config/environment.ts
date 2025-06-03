interface Environment {
  apiBaseUrl: string;
}

export const environment: Environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
}; 