import { useCallback, useState } from 'react';
import { useAuth } from '../../auth/auth.context.jsx';
import * as roleService from '../services/role.service.jsx';

export const useRoleActions = () => {
  const { setMessage, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadMe = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      const data = await roleService.getMe();
      if (data?.user) {
        setUser({ ...data.user, isAuthenticated: true });
      }
      return data;
    } catch (error) {
      setMessage(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setMessage, setUser]);

  const becomeDeveloper = useCallback(
    async (payload) => {
      setLoading(true);
      setMessage('');

      try {
        const data = await roleService.becomeDeveloper(payload);
        setUser({ ...data.user, isAuthenticated: true });
        setMessage(data.message || 'Developer profile created successfully');
        return true;
      } catch (error) {
        setMessage(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setMessage, setUser]
  );

  const becomeClient = useCallback(
    async (payload) => {
      setLoading(true);
      setMessage('');

      try {
        const data = await roleService.becomeClient(payload);
        setUser({ ...data.user, isAuthenticated: true });
        setMessage(data.message || 'Client profile created successfully');
        return true;
      } catch (error) {
        setMessage(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setMessage, setUser]
  );

  return {
    loadMe,
    becomeDeveloper,
    becomeClient,
    loading,
  };
};
