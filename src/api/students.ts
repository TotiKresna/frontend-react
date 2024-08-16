import axios from 'axios';

const BASE_URL = 'https://api-totikresna-projects.vercel.app/';

export const fetchStudents = async () => {
  return axios.get(`${BASE_URL}/students`);
};

export const createStudent = async (data: { nama: string, kelas: string }) => {
  return axios.post(`${BASE_URL}/students`, data);
};

export const getStudentById = async (id: string) => {
  return axios.get(`${BASE_URL}/students/${id}`);
};

export const updateStudent = async (id: string, data: { nama: string, kelas: string }) => {
  return axios.put(`${BASE_URL}/students/${id}`, data);
};

export const deleteStudent = async (id: string) => {
  return axios.delete(`${BASE_URL}/students/${id}`);
};

export const deleteMultipleStudents = async (ids: string[]) => {
  return axios.post(`${BASE_URL}/students/multi`, { ids });
};
