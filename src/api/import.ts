import axios from 'axios';

const BASE_URL = 'https://api-totikresna-projects.vercel.app/';

export const importExcel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${BASE_URL}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
