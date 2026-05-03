import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import { toast } from 'react-toastify';
import { Upload } from 'lucide-react';

const RoleCreationPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { user } = useAuth();
  const { createCompany, createEngineerProfile, loading } = useRoleActions();

  // Company Admin State
  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');
  const [logSources, setLogSources] = useState([
    { sourceName: '', logUrl: '', serviceType: 'backend' },
  ]);

  // Engineer State
  const [seniority, setSeniority] = useState('mid');
  const [expertise, setExpertise] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [user, navigate, role]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setCompanyLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addLogSource = () => {
    setLogSources([...logSources, { sourceName: '', logUrl: '', serviceType: 'backend' }]);
  };

  const handleLogSourceChange = (index, field, value) => {
    const updated = [...logSources];
    updated[index][field] = value;
    setLogSources(updated);
  };

  const handleSkip = () => {
    navigate('/dashboard');
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
        logSources: logSources.filter((s) => s.sourceName && s.logUrl),
        image: companyLogo,
      });
      if (success) navigate('/dashboard');
    } else if (role === 'engineer') {
      const expertiseArray = expertise
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (expertiseArray.length === 0) {
        toast.error('Please add at least one expertise (e.g. Node.js)');
        return;
      }

      if (bio && bio.length > 0 && bio.length < 10) {
        toast.error('Bio must be at least 10 characters long');
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const inviteToken = queryParams.get('invite');

      const success = await createEngineerProfile({
        seniority,
        expertise: expertiseArray,
        bio,
        image: image,
        inviteToken: inviteToken || undefined,
      });
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

              <label className="auth-field">
                Company Logo (Optional)
                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                    marginTop: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      background: companyLogoPreview ? `url(${companyLogoPreview})` : 'var(--bg-1)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '2px dashed var(--line-hi)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-3)',
                      fontSize: '2.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {!companyLogoPreview && '🏢'}
                  </div>
                  <label
                    style={{
                      cursor: 'pointer',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCompanyLogoChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--accent)',
                        color: '#000',
                        borderRadius: 'var(--r)',
                        fontWeight: '600',
                        width: 'fit-content',
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={18} />
                      Choose Logo
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      JPG, PNG or GIF (max 5MB)
                    </span>
                  </label>
                </div>
              </label>

              <div className="log-sources-section">
                <h3 style={{ margin: '1rem 0', color: '#fff' }}>Log Sources</h3>
                {logSources.map((source, index) => (
                  <div
                    key={index}
                    className="log-source-row"
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      background: '#1a1a1a',
                      borderRadius: '8px',
                    }}
                  >
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
                <button type="button" onClick={addLogSource} className="bg-transparent border border-dashed border-gray-600 text-gray-400 px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                  + Add Another Source
                </button>
              </div>
            </>
          ) : (
            <>
              <label className="auth-field">
                Profile Picture (Optional)
                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                    marginTop: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      background: previewImage ? `url(${previewImage})` : 'var(--bg-1)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '2px dashed var(--line-hi)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-3)',
                      fontSize: '2.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {!previewImage && '📷'}
                  </div>
                  <label
                    style={{
                      cursor: 'pointer',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--accent)',
                        color: '#000',
                        borderRadius: 'var(--r)',
                        fontWeight: '600',
                        width: 'fit-content',
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={18} />
                      Choose Image
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                      JPG, PNG or GIF (max 5MB)
                    </span>
                  </label>
                </div>
              </label>

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
                Bio (Optional)
                <textarea
                  className="auth-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  style={{ minHeight: '100px' }}
                />
              </label>
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={handleSkip}
              className="auth-button auth-button--secondary"
              style={{ flex: 1 }}
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="auth-button auth-button--primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Processing...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleCreationPage;
