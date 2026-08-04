import axios from "axios";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);