import axios from 'axios';

const API_URL = 'http://localhost:5000';

axios.defaults.withCredentials = true;

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/check`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const register = async (username: string, password: string, role: string = 'user') => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password, role });
    return response.data;
};

export const createAdmin = async (username: string, password: string, role: string = 'admin') => {
  const response = await axios.post(`${API_URL}/auth/create-admin`, { username, password, role });
  return response.data;
};

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};