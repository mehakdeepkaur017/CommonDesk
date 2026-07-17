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

// Resolve relative image URLs in API responses to absolute URLs
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace('/api/v1', '');
const IMAGE_URL_FIELDS = ['avatarUrl', 'logoUrl', 'secureUrl'];

const resolveUrls = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(resolveUrls);
  
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (IMAGE_URL_FIELDS.includes(key) && typeof result[key] === 'string' && result[key] && !result[key].startsWith('http')) {
      result[key] = `${API_BASE}${result[key].startsWith('/') ? '' : '/'}${result[key]}`;
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = resolveUrls(result[key]);
    }
  }
  return result;
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => resolveUrls(response.data),
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
