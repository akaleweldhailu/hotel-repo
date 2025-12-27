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
export const createRoom = (roomData) => API.post('/rooms', roomData);
export const updateRoom = (id, roomData) => API.put(`/rooms/${id}`, roomData);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);

// Bookings API
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getMyBookings = () => API.get('/bookings/my-bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// Admin API - ADD THESE
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const getAllBookings = () => API.get('/admin/bookings');
export const updateBookingStatus = (id, status) => 
  API.put(`/admin/bookings/${id}/status`, { status });

// Default export
export default API;