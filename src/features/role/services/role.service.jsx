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

export const createCompany = async (formData) => {
  try {
    const response = await api.post('/api/company/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const setupEngineerProfile = async (formData) => {
  try {
    const response = await api.post('/api/profile/setup-engineer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const inviteEngineer = async (email) => {
  try {
    const response = await api.post('/api/company/invite', { email });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getWorkspaceData = async () => {
  try {
    const response = await api.get('/api/company/members');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getInvitations = async () => {
  try {
    const response = await api.get('/api/company/invitations');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const acceptInvitation = async (inviteId) => {
  try {
    const response = await api.post('/api/company/accept-invitation', { inviteId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
