import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api', // Proxied to backend (localhost:5000)
  withCredentials: true, // Send cookies with requests
});

export const registerCustomer = async (data) => {
  return await api.post('/customers/register', data);
};

export const loginCustomer = async (data) => {
  return await api.post('/customers/login', data);
};

export const getMyProfile = async () => {
  return await api.get('/customers/me');
};

export const logoutCustomer = async () => {
  return await api.post('/customers/logout');
};

export const getProducts = async (params) => {
  return await api.get('/products', { params });
};

export const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

// Wishlist APIs
export const addToWishlist = async (productId) => {
  return await api.post(`/wishlist/${productId}`);
};

export const getWishlist = async () => {
  return await api.get('/wishlist');
};

export const removeFromWishlist = async (productId) => {
  return await api.delete(`/wishlist/${productId}`);
};

export default api;
