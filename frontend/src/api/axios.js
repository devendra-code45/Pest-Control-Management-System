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

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint)
    );

    config.headers = config.headers || {};

    if (!isPublicEndpoint) {
      const token = getStoredToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Authorization");
      } else {
        delete config.headers.Authorization;
      }
    }

    const isFormData =
      typeof FormData !== "undefined" &&
      config.data instanceof FormData;

    if (isFormData) {
      /*
       * Do not manually set multipart/form-data.
       * The browser will automatically add the required boundary.
       */
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    } else {
      /*
       * Keep all normal login, booking, payment,
       * profile and other requests as JSON.
       */
      if (typeof config.headers.set === "function") {
        config.headers.set(
          "Content-Type",
          "application/json"
        );
      } else {
        config.headers["Content-Type"] =
          "application/json";
      }
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