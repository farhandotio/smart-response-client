import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/auth.context.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import VerifyOtpPage from './features/auth/pages/VerifyOtpPage.jsx';
import RoleSelectionPage from './features/role/pages/RoleSelectionPage.jsx';
import RoleCreationPage from './features/role/pages/RoleCreationPage.jsx';
import RoleDashboardPage from './features/role/pages/RoleDashboardPage.jsx';
import ProfileOverviewPage from './features/role/pages/ProfileOverviewPage.jsx';

const RequireAuth = ({ children }) => {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="auth-loading">Loading...</div>;
  }

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
        path="/role/create/:role"
        element={
          <RequireAuth>
            <RoleCreationPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RoleDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <RequireAuth>
            <ProfileOverviewPage />
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
