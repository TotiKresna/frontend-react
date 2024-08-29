import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const importExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_URL}/api/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getImportProgress = async () => {
  const response = await axios.get(`${API_URL}/api/import/progress`);
  return response.data;
};