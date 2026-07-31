import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = [
  "/users/login",
  "/users/register",
  "/users/forgot-password",
  "/users/verify-otp",
  "/users/reset-password",
];

const getStoredToken = () => {
  const storedAuth = localStorage.getItem("pcmsAuth");

  if (storedAuth) {
    try {
      const auth = JSON.parse(storedAuth);

      const token =
        auth?.token ||
        auth?.user?.token ||
        auth?.user?.accessToken ||
        auth?.user?.jwtToken;

      if (token) {
        return token;
      }
    } catch {
      localStorage.removeItem("pcmsAuth");
    }
  }

  return localStorage.getItem("token");
};

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    const isPublicEndpoint =
      PUBLIC_ENDPOINTS.some((endpoint) =>
        url.startsWith(endpoint)
      );

    if (!isPublicEndpoint) {
      const token = getStoredToken();

      if (token) {
        config.headers = config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    } else if (config.headers) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pcmsAuth");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;