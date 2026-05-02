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
    if (user?.role === 'engineer') {
      return [
        { label: 'Seniority', value: profile?.seniority || 'N/A' },
        { label: 'Expertise', value: profile?.expertise?.join(', ') || 'N/A' },
        { label: 'Availability', value: profile?.availabilityStatus || 'Offline' },
      ];
    }

    return [
      { label: 'Organization', value: profile?.name || profile?.companyName || 'N/A' },
      { label: 'Subscription', value: profile?.subscriptionPlan || 'Free' },
    ];
  }, [profile, user?.role]);

  return (
    <div className="dashboard-shell dashboard-shell--panel">
      <div className="dashboard-panel dashboard-panel--profile">
        <div className="dashboard-head dashboard-head--compact">
          <div>
            <p className="dashboard-label">User profile</p>
            <h1 className="dashboard-title">{user?.username}</h1>
            <p className="dashboard-subtitle">Manage your role: {user?.role}</p>
          </div>
          <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
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
            {user?.role === 'engineer' && (
              <div className="dashboard-card dashboard-card--wide dashboard-card--accent">
                <p className="dashboard-card-title">Bio</p>
                <p>{profile?.bio || 'No bio added yet.'}</p>
              </div>
            )}
            {user?.role === 'company_admin' && (
              <div className="dashboard-card dashboard-card--wide dashboard-card--accent">
                <p className="dashboard-card-title">Description</p>
                <p>{profile?.description || profile?.companyDesc || 'No description provided.'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOverviewPage;
