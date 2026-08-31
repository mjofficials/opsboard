import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add interceptors here to handle global errors (like 401 for token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle unauthorized access globally (e.g. redirect to login)
      if (typeof window !== 'undefined' && !['/login', '/register', '/onboarding'].some(path => window.location.pathname.includes(path))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
