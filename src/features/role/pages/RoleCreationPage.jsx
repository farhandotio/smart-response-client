import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import { toast } from 'react-toastify';

const RoleCreationPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { user } = useAuth();
  const { createCompany, createEngineerProfile, loading } = useRoleActions();

  // Company Admin State
  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [logSources, setLogSources] = useState([{ sourceName: '', logUrl: '', serviceType: 'backend' }]);

  // Engineer State
  const [seniority, setSeniority] = useState('mid');
  const [expertise, setExpertise] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (role === 'engineer') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, role]);

  const addLogSource = () => {
    setLogSources([...logSources, { sourceName: '', logUrl: '', serviceType: 'backend' }]);
  };

  const handleLogSourceChange = (index, field, value) => {
    const updated = [...logSources];
    updated[index][field] = value;
    setLogSources(updated);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (role === 'company_admin') {
      if (!companyName || !companyDesc) {
        toast.error('Company name and description are required.');
        return;
      }
      
      const success = await createCompany({ 
        name: companyName, 
        description: companyDesc, 
        logSources: logSources.filter(s => s.sourceName && s.logUrl) 
      });
      if (success) navigate('/dashboard');
    } else if (role === 'engineer') {
      const expertiseArray = expertise.split(',').map(s => s.trim()).filter(Boolean);
      
      if (expertiseArray.length === 0) {
        toast.error('Please add at least one expertise (e.g. Node.js)');
        return;
      }

      if (bio && bio.length < 10) {
        toast.error('Bio must be at least 10 characters long');
        return;
      }

      const success = await createEngineerProfile({ seniority, expertise: expertiseArray, bio });
      if (success) navigate('/dashboard');
    }
  };

  const isCompanyAdmin = role === 'company_admin';
  const title = isCompanyAdmin ? 'Register Your Company' : 'Complete Your Engineer Profile';

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">
          {isCompanyAdmin 
            ? 'Set up your workspace to start monitoring incidents and logs.' 
            : 'Help your team know your expertise and availability.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isCompanyAdmin ? (
            <>
              <label className="auth-field">
                Company Name
                <input
                  className="auth-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  required
                />
              </label>

              <label className="auth-field">
                Description
                <textarea
                  className="auth-input"
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  placeholder="Describe your company"
                />
              </label>

              <div className="log-sources-section">
                <h3 style={{ margin: '1rem 0', color: '#fff' }}>Log Sources</h3>
                {logSources.map((source, index) => (
                  <div key={index} className="log-source-row" style={{ marginBottom: '1rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
                    <input
                      className="auth-input"
                      value={source.sourceName}
                      onChange={(e) => handleLogSourceChange(index, 'sourceName', e.target.value)}
                      placeholder="Source Name (e.g. API Server)"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <input
                      className="auth-input"
                      value={source.logUrl}
                      onChange={(e) => handleLogSourceChange(index, 'logUrl', e.target.value)}
                      placeholder="Log URL (e.g. s3://logs/api)"
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <select
                      className="auth-input"
                      value={source.serviceType}
                      onChange={(e) => handleLogSourceChange(index, 'serviceType', e.target.value)}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                    </select>
                  </div>
                ))}
                <button type="button" onClick={addLogSource} className="auth-link-button">
                  + Add Another Source
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="auth-field">
                Seniority
                <select
                  className="auth-input"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </label>

              <label className="auth-field">
                Expertise (comma separated)
                <input
                  className="auth-input"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  placeholder="e.g. Node.js, AWS, Kubernetes"
                />
              </label>

              <label className="auth-field">
                Bio
                <textarea
                  className="auth-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </label>
            </>
          )}

          <button type="submit" className="auth-button auth-button--primary" disabled={loading} style={{ marginTop: '2rem' }}>
            {loading ? 'Processing...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleCreationPage;
