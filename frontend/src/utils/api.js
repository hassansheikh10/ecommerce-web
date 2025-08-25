import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const apiKey = process.env.NEXT_PUBLIC_API_SECRET || "2Fz$wQjVn#x!H7tY@P3fR8bLz%uK9eN5cS0mD^rG1yW";
  console.log("🔑 Sending API Key:", apiKey);

  config.headers["x-api-key"] = apiKey;

  return config;
});

export default api; 