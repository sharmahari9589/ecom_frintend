import axios from "axios";
import Cookies from "js-cookie";
const API = axios.create({
  baseURL: "http://localhost:8000/v1",
});

API.interceptors.request.use((req) => {
  const token = Cookies.get("token");
  console.log(token);
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
