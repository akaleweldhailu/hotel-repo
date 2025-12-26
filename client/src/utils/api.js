import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getProfile = () => API.get('/auth/profile');

// Rooms API
export const getRooms = () => API.get('/rooms');
export const getRoom = (id) => API.get(`/rooms/${id}`);

// Bookings API
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

export default API;