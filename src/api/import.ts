import axios from 'axios';

const BASE_URL = 'https://backend-api-rosy.vercel.app';
// const BASE_URL = 'http://localhost:5000';

export const importExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${BASE_URL}/api/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
