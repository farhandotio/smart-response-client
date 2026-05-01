import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';

const ProfileOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadMe } = useRoleActions();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const data = await loadMe();
      if (data?.profile) setProfile(data.profile);
      setLoading(false);
    };

    if (user?.isAuthenticated) {
      fetchProfile();
    }
  }, [loadMe, user?.isAuthenticated]);

  const sections = useMemo(() => {
    if (user?.role === 'developer') {
      return [
        { label: 'Experience', value: `${profile?.experienceYears || 'N/A'} years` },
        { label: 'Tech Stack', value: profile?.techStack?.join(', ') || 'N/A' },
        { label: 'Rate Range', value: `$${profile?.rateMin || 'N/A'} - $${profile?.rateMax || 'N/A'}` },
      ];
    }

    return [
      { label: 'Company', value: profile?.companyName || 'N/A' },
      { label: 'Description', value: profile?.companyDesc || 'N/A' },
    ];
  }, [profile, user?.role]);

  return (
    <div className="dashboard-shell dashboard-shell--panel">
      <div className="dashboard-panel dashboard-panel--profile">
        <div className="dashboard-head dashboard-head--compact">
          <div>
            <p className="dashboard-label">Profile overview</p>
            <h1 className="dashboard-title">{user?.username || 'Profile'}</h1>
            <p className="dashboard-subtitle">Manage your public details and role information.</p>
          </div>
          <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
            Back to overview
          </button>
        </div>

        {loading ? (
          <div className="auth-output">Loading profile...</div>
        ) : (
          <div className="dashboard-grid dashboard-overview-grid">
            {sections.map((item) => (
              <div key={item.label} className="dashboard-card dashboard-card--accent">
                <p className="dashboard-card-title">{item.label}</p>
                <strong>{item.value}</strong>
              </div>
            ))}
            {user?.role === 'developer' && (
              <div className="dashboard-card dashboard-card--wide dashboard-card--accent">
                <p className="dashboard-card-title">Bio</p>
                <p>{profile?.bio || 'No bio added yet.'}</p>
              </div>
            )}
            {user?.role === 'developer' && (
              <div className="dashboard-card dashboard-card--wide dashboard-card--accent">
                <p className="dashboard-card-title">Portfolio Link</p>
                <p>{profile?.portfolioLink || 'Not provided'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverviewPage;
