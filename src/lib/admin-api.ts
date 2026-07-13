import axios, { type AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "se_admin_token";
const REFRESH_KEY = "se_admin_refresh";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setTokens(access: string, refresh?: string) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const adminApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 12000, // fail fast instead of hanging if the API is unreachable
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem(REFRESH_KEY);
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
          setTokens(data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return adminApi(original);
        } catch {
          clearTokens();
          if (typeof window !== "undefined") window.location.href = "/admin/login";
        }
      } else if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function login(username: string, password: string) {
  const { data } = await axios.post(`${API_URL}/auth/token/`, { username, password });
  setTokens(data.access, data.refresh);
  // verify admin rights
  const me = await adminApi.get("/admin/me/");
  if (!me.data.is_staff) {
    clearTokens();
    throw new Error("This account does not have admin access.");
  }
  return me.data;
}

// Generic list that unwraps DRF pagination
export async function adminList<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
  const { data } = await adminApi.get(path, { params: { page_size: 100, ...params } });
  return Array.isArray(data) ? data : data.results;
}

export interface UploadResult {
  url: string;
  type: "image" | "video";
  name: string;
}

/** Upload a file to the backend and get back its served URL. */
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await adminApi.post("/admin/upload/", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // videos can be large
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data;
}

export { API_URL };
