import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';

const RoleCreationPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { user, message, setMessage } = useAuth();
  const { becomeDeveloper, becomeClient, loading } = useRoleActions();

  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [techStack, setTechStack] = useState('');
  const [rateMin, setRateMin] = useState('');
  const [rateMax, setRateMax] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setMessage('');
  }, [role, setMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (role === 'developer') {
      const techStackArray = techStack
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (!experienceYears || techStackArray.length === 0 || !rateMin || !rateMax || !bio) {
        setMessage('All developer fields are required, and at least one skill must be provided.');
        return;
      }

      const success = await becomeDeveloper({
        experienceYears: Number(experienceYears),
        techStack: techStackArray,
        rateMin: Number(rateMin),
        rateMax: Number(rateMax),
        bio,
        portfolioLink,
      });
      if (success) navigate('/dashboard');
      return;
    }

    if (role === 'client') {
      if (!companyName || !companyDesc) {
        setMessage('Company name and description are required.');
        return;
      }
      const success = await becomeClient({ companyName, companyDesc });
      if (success) navigate('/dashboard');
      return;
    }

    navigate('/select-role');
  };

  const roleLabel = role === 'developer' ? 'Developer' : 'Client';
  const title = role === 'developer' ? 'Create Developer Profile' : 'Create Client Profile';

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">
          {role === 'developer'
            ? 'Tell us more about your skills and the type of work you take on.'
            : 'Provide a short company description to start posting work requests.'}
        </p>
        {message && <div className="auth-output">{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {role === 'developer' ? (
            <>
              <label className="auth-field">
                Years of Experience
                <input
                  type="number"
                  className="auth-input"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 3"
                />
              </label>

              <label className="auth-field">
                Tech Stack
                <input
                  className="auth-input"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node, MongoDB"
                />
              </label>

              <label className="auth-field">
                Minimum Rate
                <input
                  type="number"
                  className="auth-input"
                  value={rateMin}
                  onChange={(e) => setRateMin(e.target.value)}
                  placeholder="e.g. 30"
                />
              </label>

              <label className="auth-field">
                Maximum Rate
                <input
                  type="number"
                  className="auth-input"
                  value={rateMax}
                  onChange={(e) => setRateMax(e.target.value)}
                  placeholder="e.g. 80"
                />
              </label>

              <label className="auth-field">
                Bio
                <textarea
                  className="auth-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your expertise and the projects you love."
                />
              </label>

              <label className="auth-field">
                Portfolio Link
                <input
                  className="auth-input"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="Optional portfolio URL"
                />
              </label>
            </>
          ) : (
            <>
              <label className="auth-field">
                Company Name
                <input
                  className="auth-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </label>

              <label className="auth-field">
                Company Description
                <textarea
                  className="auth-input"
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  placeholder="Describe your company and the work you need done."
                />
              </label>
            </>
          )}

          <button type="submit" className="auth-button auth-button--primary" disabled={loading}>
            {loading ? 'Saving...' : `Continue as ${roleLabel}`}
          </button>
        </form>

        <div className="auth-footer">
          <button type="button" className="auth-link-button" onClick={() => navigate('/select-role')}>
            Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleCreationPage;
