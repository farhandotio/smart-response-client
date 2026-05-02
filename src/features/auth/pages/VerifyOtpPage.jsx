import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';
import { useVerifyOtp } from '../hooks/useAuthActions.jsx';
import { toast } from 'react-toastify';

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
      <div className="auth-card">
        <h1 className="auth-title" style={{ textAlign: 'center' }}>Verify OTP</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>
          Enter the code sent to <span className="auth-highlight">{pendingRegister?.email}</span>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="otp-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.6rem', 
            margin: '2rem 0' 
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength="1"
                className="auth-input"
                style={{ 
                  width: '3.2rem', 
                  height: '3.8rem', 
                  textAlign: 'center', 
                  fontSize: '1.4rem', 
                  fontWeight: 'bold',
                  padding: 0,
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)'
                }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Resend OTP in <span className="auth-highlight">{formatTime(timer)}</span>
          </p>

          <button type="submit" className="auth-button auth-button--primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          Wait, I used the wrong email?{' '}
          <button className="auth-link-button" type="button" onClick={() => navigate('/register')}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
