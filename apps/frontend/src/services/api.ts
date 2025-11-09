import axios from "axios";

// Try direct connection first, fallback to proxy
// Direct connection works better for CORS when backend has proper CORS setup
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log('API Base URL:', API_BASE);
console.log('Environment:', import.meta.env.MODE);

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes timeout for trace operations (requests can take 40+ seconds)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const fetchTrace = async (signature: string, depth = 4) => {
  const res = await api.get(`/solana/trace/${signature}?depth=${depth}`);
  return res.data;
};
