import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';
import { useVerifyOtp } from '../hooks/useAuthActions.jsx';

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const { pendingRegister, message, setMessage } = useAuth();
  const { verifyOtp, loading } = useVerifyOtp();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!pendingRegister?.email) {
      navigate('/register');
    }
  }, [pendingRegister, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    const success = await verifyOtp(otp);
    if (success) navigate('/select-role');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">Verify OTP</h1>
        <p className="auth-subtitle">
          Enter the 6-digit code sent to <strong>{pendingRegister?.email || 'your email'}</strong> to complete registration.
        </p>
        {message && <div className="auth-output">{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            OTP Code
            <input
              type="text"
              className="auth-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </label>

          <button type="submit" className="auth-button auth-button--primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered?{' '}
          <button className="auth-link-button" type="button" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
