import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (data: { email: string; password: string; name: string; role: 'CLIENT' | 'VENDOR' }) =>
    api.post('/auth/register', data),
  login: async (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Products API
export const products = {
  getAll: async () => api.get('/products'),
  getOne: async (id: string) => api.get(`/products/${id}`),
  create: async (data: { name: string; description: string; price: number; image: string }) =>
    api.post('/products', data),
  update: async (id: string, data: { name: string; description: string; price: number; image: string }) =>
    api.put(`/products/${id}`, data),
  delete: async (id: string) => api.delete(`/products/${id}`),
};

// Orders API
export const orders = {
  getMyOrders: async () => api.get('/orders/my-orders'),
  create: async (data: { items: { productId: string; quantity: number }[]; transactionId?: string }) =>
    api.post('/orders', data),
  updateStatus: async (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// Vendor API
export const vendor = {

  updateKkiapayId: async (kkiapayId: string) =>
    api.post('/vendor/kkiapay', { kkiapayId }),
  getOrders: async () => api.get('/vendor/orders'),
  getProducts: async () => api.get('/vendor/products'),
  getDetails: async (vendorId: string) => api.get(`/vendor/${vendorId}`),
};
