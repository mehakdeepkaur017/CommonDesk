import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("commondesk_token");
    const workspaceId = localStorage.getItem("commondesk_workspace");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (workspaceId && config.headers) {
      config.headers["x-workspace-id"] = workspaceId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle Network Errors
    if (!error.response) {
      error.response = {
        data: { message: "Network error or server offline. Please try again." }
      };
      return Promise.reject(error);
    }

    // Handle session expiration (401 Unauthorized)
    if (error.response.status === 401) {
      localStorage.removeItem("commondesk_token");
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
