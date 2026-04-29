import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/auth.context.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import VerifyOtpPage from './features/auth/pages/VerifyOtpPage.jsx';
import RoleSelectionPage from './features/auth/pages/RoleSelectionPage.jsx';
import RolePage from './features/auth/pages/RolePage.jsx';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  return user?.isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route
        path="/select-role"
        element={
          <RequireAuth>
            <RoleSelectionPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RolePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <AuthProvider>
    <AuthApp />
  </AuthProvider>
);

export default App;
