import axios, { type AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "se_customer_token";
const REFRESH_KEY = "se_customer_refresh";

export function getCustomerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
function setTokens(access: string, refresh?: string) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearCustomerTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const customerApi: AxiosInstance = axios.create({ baseURL: API_URL, timeout: 20000 });

customerApi.interceptors.request.use((config) => {
  const t = getCustomerToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

customerApi.interceptors.response.use(
  (r) => r,
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
          return customerApi(original);
        } catch {
          clearCustomerTokens();
          if (typeof window !== "undefined") window.location.href = "/portal/login";
        }
      } else if (typeof window !== "undefined") {
        window.location.href = "/portal/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function customerLogin(username: string, password: string) {
  const { data } = await axios.post(`${API_URL}/auth/token/`, { username, password });
  setTokens(data.access, data.refresh);
  const me = await customerApi.get("/me/");
  return me.data;
}

export { API_URL };
