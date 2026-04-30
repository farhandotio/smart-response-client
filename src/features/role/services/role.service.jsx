import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
  const message = error?.response?.data?.message || error.message || 'Request failed';
  throw new Error(message);
};

export const getMe = async () => {
  try {
    const response = await api.get('/api/profile/me');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const becomeDeveloper = async (payload) => {
  try {
    const response = await api.post('/api/profile/become-developer', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const becomeClient = async (payload) => {
  try {
    const response = await api.post('/api/profile/become-client', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
