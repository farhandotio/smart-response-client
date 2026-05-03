import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth.context.jsx';
import { useLogin } from '../hooks/useAuthActions.jsx';
import { User, Lock, ArrowRight, Zap } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setMessage } = useAuth();
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        <div className="auth-brand">
           <Zap className="brand-icon" size={32} />
           <span className="brand-text">SIRP AI</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your command center</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field-group">
            <label className="auth-label">Username or Email</label>
            <div className="auth-input-wrapper">
              <User className="input-icon" size={18} />
              <input
                className="auth-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your identifier"
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="auth-button auth-button--primary" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                Continue to Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          <span>New to SIRP?</span>
          <button className="auth-link-button" type="button" onClick={() => navigate('/register')}>
            Create an account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
