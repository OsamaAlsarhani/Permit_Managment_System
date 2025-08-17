import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  }
});

export const setBasicAuthHeader = (username, password) => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers.common["Authorization"] = `Basic ${token}`;
};




export const clearAuthHeader = () => {
  delete api.defaults.headers.common['Authorization'];
};
api.interceptors.request.use(req => {
  console.log('Outgoing request headers:', req.headers);
  return req;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.warn('Received 401, clearing auth header');
      clearAuthHeader();
      // optional: redirect to login
    }
    return Promise.reject(err);
  }
);

export default api;
