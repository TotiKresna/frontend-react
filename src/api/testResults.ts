import axios from 'axios';

const BASE_URL = 'https://backend-api-rosy.vercel.app';
// const BASE_URL = 'http://localhost:5000';

export const fetchTestResults = async () => {
  return axios.get(`${BASE_URL}/api/test-results`);
};

export const createTestResult = async (data: any) => {
  return axios.post(`${BASE_URL}/api/test-results`, data);
};

export const updateTestResult = async (id: string, data: any) => {
  return axios.put(`${BASE_URL}/api/test-results/${id}`, data);
};

export const deleteTestResult = async (id: string) => {
  return axios.delete(`${BASE_URL}/api/test-results/${id}`);
};

export const deleteMultipleTestResults = async (ids: string[]) => {
  return axios.post(`${BASE_URL}/api/test-results/multi`, { ids });
};
