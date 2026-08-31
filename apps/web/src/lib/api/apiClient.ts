import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

export const apiClient = axios.create({
  baseURL: 'https://opsboard-supabase-proxy.manojmarimuthu1995.workers.dev/rest/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // We use the browser client here. Ensure this client is only used in Client Components
    // or passing the auth token explicitly if used on the server.
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login or clear session)
      if (typeof window !== 'undefined') {
        // Simple client-side redirect
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
