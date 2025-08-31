import axios from "axios";

const API_URL: string =
  import.meta.env.VITE_APP_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;