import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "", 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mockToken");

    if (token) {
      // config.headers.Authorization = `Bearer ${token}`;
    }
    else if (!token){
       window.location.href = "/";
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
