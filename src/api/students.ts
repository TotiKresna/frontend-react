import axios from 'axios';

const BASE_URL = 'https://backend-api-rosy.vercel.app';
// const BASE_URL = 'http://localhost:5000';

export const fetchStudents = async () => {
  return axios.get(`${BASE_URL}/api/students`);
};

export const createStudent = async (data: { nama: string, kelas: string }) => {
  return axios.post(`${BASE_URL}/api/students`, data);
};

export const getStudentById = async (id: string) => {
  return axios.get(`${BASE_URL}/api/students/${id}`);
};

export const updateStudent = async (id: string, data: { nama: string, kelas: string }) => {
  return axios.put(`${BASE_URL}/api/students/${id}`, data);
};

export const deleteStudent = async (id: string) => {
  return axios.delete(`${BASE_URL}/api/students/${id}`);
};

export const deleteMultipleStudents = async (ids: string[]) => {
  return axios.post(`${BASE_URL}/api/students/multi`, { ids });
};
