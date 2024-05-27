import axios from 'axios';

const BASE_URL = 'https://backend-simmd.vercel.app';

export const fetchTestResults = async () => {
  return axios.get(`${BASE_URL}/test-results`);
};

export const createTestResult = async (data: any) => {
  return axios.post(`${BASE_URL}/test-results`, data);
};

export const updateTestResult = async (id: string, data: any) => {
  return axios.put(`${BASE_URL}/test-results/${id}`, data);
};

export const deleteTestResult = async (id: string) => {
  return axios.delete(`${BASE_URL}/test-results/${id}`);
};

export const deleteMultipleTestResults = async (ids: string[]) => {
  return axios.post(`${BASE_URL}/test-results/multi`, { ids });
};
