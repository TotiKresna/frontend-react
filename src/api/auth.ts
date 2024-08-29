import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
  localStorage.removeItem('token');
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

export const createUser = async (username: string, password: string, role: string = 'admin') => {
  const response = await axios.post(`${API_URL}/auth/create-admin`, { username, password, role });
  return response.data;
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/superadmin/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, username: string, password?: string, role?: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/superadmin/updateUser`, { id, username, password, role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/auth/superadmin/deleteUser`, { data: { id } });
    return response.data;
  } catch (error) {
    throw error;
  }
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