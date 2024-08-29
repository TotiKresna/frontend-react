import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchTestResults = async () => {
  return axios.get(`${API_URL}/api/test-results`);
};

export const createTestResult = async (data: any) => {
  return axios.post(`${API_URL}/api/test-results`, data);
};

export const updateTestResult = async (id: string, data: any) => {
  return axios.put(`${API_URL}/api/test-results/${id}`, data);
};

export const deleteTestResult = async (id: string) => {
  return axios.delete(`${API_URL}/api/test-results/${id}`);
};

export const deleteMultipleTestResults = async (ids: string[]) => {
  return axios.post(`${API_URL}/api/test-results/multi`, { ids });
};
