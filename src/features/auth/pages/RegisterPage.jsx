import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth.context.jsx';
import { useRegister } from '../hooks/useAuthActions.jsx';
import { User, Mail, Lock, UserPlus, Zap } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setMessage } = useAuth();
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card auth-card--wide"
      >
        <div className="auth-brand">
           <Zap className="brand-icon" size={32} />
           <span className="brand-text">SIRP AI</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the elite network of incident responders</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grid-2">
            <div className="auth-field-group">
              <label className="auth-label">Username</label>
              <div className="auth-input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  required
                />
              </div>
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
            {loading ? 'Processing...' : (
              <>
                Create Account
                <UserPlus size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button className="auth-link-button" type="button" onClick={() => navigate('/login')}>
            Log in here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
