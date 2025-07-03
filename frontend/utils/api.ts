import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postToBackend<T>(endpoint: string, data: any, token?: string): Promise<T> {
  const res = await axios.post(`${BASE_URL}${endpoint}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
} 