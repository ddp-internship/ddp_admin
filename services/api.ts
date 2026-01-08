import axios, { AxiosError, AxiosRequestConfig } from "axios";

/**
 * WAJIB:
 * - VITE_API_URL berisi ORIGIN saja (tanpa /api)
 *   contoh:
 *   - https://noncruciform-interfamily-gidget.ngrok-free.dev
 *   - https://ddp-public-service-697396166345.asia-southeast2.run.app
 */
const ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8085").replace(
  /\/+$/,
  ""
);

const BASE_URL = ORIGIN + "/api";

// kirim header ngrok-skip cuma kalau memang pakai ngrok
const isNgrok = /ngrok-free\.dev$/i.test(new URL(ORIGIN).host);

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    ...(isNgrok ? { "ngrok-skip-browser-warning": "69420" } : {}),
  },
  timeout: 30000,
});

// ===== Helpers =====
function getToken(): string | null {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token")
  );
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("ddp_user");
}

function normalizeResource(resource: string) {
  return String(resource || "").replace(/^\/+/, "");
}

// ===== Interceptors =====

// Tempel Bearer token otomatis
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = (config.headers || {}) as any;
    (config.headers as any).Authorization = "Bearer " + token;
  }
  return config;
});

// Logout otomatis jika 401
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearAuth();

      // kalau pakai hash router
      if (typeof window !== "undefined") {
        window.location.hash = "#/login";
      }
    }

    return Promise.reject(error);
  }
);

// ===== API Service =====
export const apiService = {
  // --- AUTH ---
  async login(email: string, password: string) {
    const response = await API.post("/login", { email, password });

    const token = response.data?.access_token;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
    }

    return response.data?.user;
  },

  async register(name: string, email: string, password: string) {
    const response = await API.post("/register", { name, email, password });
    return response.data;
  },

  async logout() {
    try {
      await API.post("/logout");
    } finally {
      clearAuth();
    }
  },

  // --- USERS ---
  async getUsers() {
    const response = await API.get("/users");
    return response.data;
  },

  async toggleApproval(id: number) {
    const response = await API.post(`/users/${id}/toggle-approve`);
    return response.data;
  },

  // --- GENERIC CRUD ---
  async getData(resource: string) {
    const res = normalizeResource(resource);
    const response = await API.get(`/${res}`);
    return response.data;
  },

  async saveData(resource: string, data: any) {
    const res = normalizeResource(resource);

    const formData = new FormData();
    Object.keys(data || {}).forEach((key) => {
      const value = data[key];

      if (key === "gambar" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append("gambar[]", file);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (data?.id) {
      formData.append("_method", "PUT");
      const response = await API.post(`/${res}/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await API.post(`/${res}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteData(resource: string, id: number) {
    const res = normalizeResource(resource);
    const response = await API.delete(`/${res}/${id}`);
    return response.data;
  },

  // --- TOGGLE HOME/FEATURED ---
  async toggleMonografiFeatured(id: number) {
    const response = await API.post(`/monografi/${id}/toggle-featured`);
    return response.data;
  },

  async toggleInfografisHome(id: number) {
    const response = await API.post(`/infografis/${id}/toggle-home`);
    return response.data;
  },

  async toggleTestimoniTampil(id: number) {
    const response = await API.post(`/testimoni/${id}/toggle-tampil`);
    return response.data;
  },

  // --- STATS ---
  async getStats() {
    const response = await API.get("/stats/capaian");
    return response.data;
  },
};

export default API;

