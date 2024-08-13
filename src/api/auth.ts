import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data;
};

export const register = async (username: string, password: string, role: 'admin' | 'teacher' | 'student') => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password, role });
    return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
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