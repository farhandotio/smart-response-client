import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../auth.context.jsx';
import * as authService from '../services/auth.service.jsx';

export const useRegister = () => {
  const { setMessage, setPendingRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const register = async ({ username, email, password }) => {
    if (!username || !email || !password) {
      toast.error('All fields are required for registration.');
      return false;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await authService.registerUser({ username, email, password });
      setPendingRegister({ username, email, password });
      toast.success(data.message || 'OTP sent. Check your email.');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};

export const useVerifyOtp = () => {
  const { pendingRegister, setMessage, setUser, setPendingRegister } = useAuth();
  const [loading, setLoading] = useState(false);

  const verifyOtp = async (otp) => {
    if (!pendingRegister?.email) {
      toast.error('Registration data missing. Please register again.');
      return false;
    }

    if (!otp) {
      toast.error('Please enter the OTP sent to your email.');
      return false;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await authService.verifyOtp({ 
        email: pendingRegister.email, 
        otp 
      });
      setUser({
        username: data.user.username,
        email: data.user.email,
        role: null,
        isAuthenticated: true,
      });
      setPendingRegister(null);
      toast.success(data.message || 'Registration complete. Choose a role.');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading };
};

export const useLogin = () => {
  const { setMessage, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = async ({ identifier, password }) => {
    if (!identifier || !password) {
      toast.error('Please enter username/email and password.');
      return false;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await authService.loginUser({ identifier, password });
      setUser({
        username: data.user.username,
        email: data.user.email,
        role: data.user.role || null,
        isAuthenticated: true,
      });
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
