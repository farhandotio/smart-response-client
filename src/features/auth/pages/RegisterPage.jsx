import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';
import { useRegister } from '../hooks/useAuthActions.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { message, setMessage } = useAuth();
  const { register, loading } = useRegister();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    const success = await register({ username, email, password });
    if (success) navigate('/verify-otp');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">Register</h1>
        <p className="auth-subtitle">Create your account and choose your role next.</p>
        {message && <div className="auth-output">{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Username
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <label className="auth-field">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </label>

          <button type="submit" className="auth-button auth-button--primary" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <button className="auth-link-button" type="button" onClick={() => navigate('/login')}>
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
