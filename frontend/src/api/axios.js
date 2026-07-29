import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("pcmsAuth");

    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);

        const token =
          auth?.token ||
          auth?.user?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem("pcmsAuth");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
