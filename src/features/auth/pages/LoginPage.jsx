import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';
import { useLogin } from '../hooks/useAuthActions.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, message, setMessage } = useAuth();
  const { login, loading } = useLogin();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    const data = await login({ identifier, password });
    if (data?.user) {
      if (data.user.role) {
        navigate('/dashboard');
      } else {
        navigate('/select-role');
      }
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Enter your username, email, and password to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Username or Email
            <input
              className="auth-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your username or email"
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        <div className="auth-footer">
          New user?{' '}
          <button className="auth-link-button" type="button" onClick={() => navigate('/register')}>
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
