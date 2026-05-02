import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth.context.jsx';
import { useVerifyOtp } from '../hooks/useAuthActions.jsx';
import { toast } from 'react-toastify';
import { Zap, ShieldCheck, RefreshCw } from 'lucide-react';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const { pendingRegister, setMessage } = useAuth();
  const { verifyOtp, loading } = useVerifyOtp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    if (!pendingRegister?.email) {
      navigate('/register');
    }
  }, [pendingRegister, navigate]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }
    setMessage('');
    const success = await verifyOtp(otpValue);
    if (success) navigate('/select-role');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

        <h1 className="auth-title">Verify Email</h1>
        <p className="auth-subtitle">
          Secure code sent to <br />
          <strong className="auth-highlight">{pendingRegister?.email}</strong>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="otp-grid">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                whileFocus={{ scale: 1.05, borderColor: 'var(--accent)' }}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <div className="otp-status">
            {timer > 0 ? (
              <p className="auth-subtitle">
                Resend code in <span className="auth-highlight">{formatTime(timer)}</span>
              </p>
            ) : (
              <button className="auth-link-button" type="button" style={{ fontSize: '0.9rem' }}>
                <RefreshCw size={14} />
                Resend Code Now
              </button>
            )}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="auth-button auth-button--primary" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : (
              <>
                Validate Security Code
                <ShieldCheck size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          <span>Entered wrong email?</span>
          <button className="auth-link-button" type="button" onClick={() => navigate('/register')}>
            Change Email
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
