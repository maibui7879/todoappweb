// src/api/axiosClient.ts
import axios from "axios";
import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

const axiosClient = axios.create({
  baseURL:  "https://sybausuzuka-todoapp.hf.space",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (token && config.headers && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ====================
// RESPONSE INTERCEPTOR
// ====================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,

  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    // ❗ giữ nguyên error để FE đọc được message
    return Promise.reject(error);
  },
);

export default axiosClient;
