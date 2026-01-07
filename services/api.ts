import axios from 'axios';

const baseURL = 'http://ddp_api.test/api';

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Interceptor: Tempelkan Token secara otomatis
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Logout otomatis jika session habis (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('ddp_user');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // --- AUTHENTICATION ---
  async login(email: string, password: string) {
    const response = await API.post('/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data.user;
  },

  async register(name: string, email: string, password: string) {
    const response = await API.post('/register', { name, email, password });
    return response.data;
  },

  async logout() {
    try { await API.post('/logout'); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('ddp_user');
    }
  },

  // --- USER MANAGEMENT ---
  async getUsers() {
    const response = await API.get('/users');
    return response.data;
  },

  async toggleApproval(id: number) {
    const response = await API.post(`/users/${id}/toggle-approve`);
    return response.data;
  },

  // --- GENERIC CRUD (Handel Gambar & Teks) ---
  async getData(resource: string) {
    const response = await API.get(`/${resource}`);
    return response.data;
  },

  async saveData(resource: string, data: any) {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (key === 'gambar' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('gambar[]', file);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (data.id) {
      formData.append('_method', 'PUT');
      const response = await API.post(`/${resource}/${data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      const response = await API.post(`/${resource}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  async deleteData(resource: string, id: number) {
    const response = await API.delete(`/${resource}/${id}`);
    return response.data;
  },

  // --- KHUSUS TOGGLE BERANDA ---
  async toggleMonografiFeatured(id: number) {
    const response = await API.post(`/monografi/${id}/toggle-featured`);
    return response.data;
  },

  async toggleInfografisHome(id: number) {
    const response = await API.post(`/infografis/${id}/toggle-home`);
    return response.data;
  },

  // --- STATISTICS ---
  async getStats() {
    const response = await API.get('/stats/capaian');
    return response.data;
  }, // <--- SAYA SUDAH TAMBAHKAN KOMA DI SINI

  // --- KHUSUS TOGGLE TESTIMONI (LIMIT 3) ---
  async toggleTestimoniTampil(id: number) {
    const response = await API.post(`/testimoni/${id}/toggle-tampil`);
    return response.data;
  }
};