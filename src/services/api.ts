import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
  console.warn("⚠️ API base URL não configurada em .env");
}

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `[API ERROR] ${error.response?.status}: ${
        error.response?.data?.detail || error.message
      }`
    );
    return Promise.reject(error);
  }
);
