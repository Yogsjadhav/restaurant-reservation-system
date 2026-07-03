import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-reservation-system-o33b.onrender.com/';
const API_URL = process.env.REACT_APP_API_URL || 'https://restaurant-reservation-system-o33b.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
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

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Reservation services
export const reservationService = {
  createReservation: (data) => api.post('/reservations', data),
  getMyReservations: () => api.get('/reservations/my-reservations'),
  cancelReservation: (id) => api.delete(`/reservations/${id}`),
  getAllReservations: (params) => api.get('/reservations/admin/all', { params }),
  updateReservation: (id, data) => api.put(`/reservations/admin/${id}`, data),
  getAvailableSlots: (params) => api.get('/reservations/available-slots', { params })
};

// Table services
export const tableService = {
  getTables: () => api.get('/tables'),
  createTable: (data) => api.post('/tables', data),
  updateTable: (id, data) => api.put(`/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/tables/${id}`)
};

export default api;
