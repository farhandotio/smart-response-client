import './styles/auth.scss';
import { createContext, useContext, useState } from 'react';

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

  return (
    <AuthContext.Provider
      value={{
        user,
        message,
        pendingRegister,
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
