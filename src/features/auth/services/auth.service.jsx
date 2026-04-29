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

export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await api.post('/api/otp/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async ({ identifier, password }) => {
  try {
    const response = await api.post('/api/auth/login', { identifier, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
