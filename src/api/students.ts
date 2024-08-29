import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchStudents = async () => {
  return axios.get(`${API_URL}/api/students`);
};

export const createStudent = async (data: { nama: string, kelas: string }) => {
  return axios.post(`${API_URL}/api/students`, data);
};

export const getStudentById = async (id: string) => {
  return axios.get(`${API_URL}/api/students/${id}`);
};

export const updateStudent = async (id: string, data: { nama: string, kelas: string }) => {
  return axios.put(`${API_URL}/api/students/${id}`, data);
};

export const deleteStudent = async (id: string) => {
  return axios.delete(`${API_URL}/api/students/${id}`);
};

export const deleteMultipleStudents = async (ids: string[]) => {
  return axios.post(`${API_URL}/api/students/multi`, { ids });
};
