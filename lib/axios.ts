import Axios from "axios";

const axiosClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER");
      // window.location.href = "/";
    } else {
      console.log(error.message);
      // toast.error(error.message);
    }

    throw error;
  },
);

export default axiosClient;
