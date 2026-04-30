import './styles/auth.scss';
import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from './services/auth.service.jsx';

const AuthContext = createContext(null);

const getStoredPendingRegister = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('pendingRegister');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [pendingRegister, setPendingRegisterState] = useState(getStoredPendingRegister);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const setPendingRegister = (value) => {
    setPendingRegisterState(value);
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem('pendingRegister', JSON.stringify(value));
      } else {
        localStorage.removeItem('pendingRegister');
      }
    }
  };

  const selectRole = (role) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, role }));
    setMessage('');
  };

  const logout = () => {
    setUser(null);
    setPendingRegister(null);
    setMessage('');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsAuthLoading(true);

      try {
        const data = await authService.getCurrentUser();
        if (data?.user) {
          setUser({ ...data.user, isAuthenticated: true });
        }
      } catch {
        setUser(null);
      } finally {
        setIsAuthReady(true);
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        message,
        pendingRegister,
        isAuthReady,
        isAuthLoading,
        selectRole,
        logout,
        setMessage,
        setPendingRegister,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
