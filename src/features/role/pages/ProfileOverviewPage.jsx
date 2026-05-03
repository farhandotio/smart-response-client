import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const ProfileOverviewPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    <div className="dashboard-layout">
      <Sidebar 
        role={user?.role} 
        activeTab="profile" 
        setActiveTab={(tab) => {
          if (tab !== 'profile') navigate('/dashboard');
        }} 
      />
      
      <main className="dashboard-main">
        <TopNav user={user} logout={logout} />
        
        <div className="dashboard-content">
          <header style={{ marginBottom: '2.5rem' }}>
            <p className="dashboard-label">User Profile</p>
            <h1 className="dashboard-title">{user?.username}</h1>
            <p className="dashboard-subtitle" style={{ color: 'var(--text-3)', marginTop: '0.5rem' }}>
              Manage your role: {user?.role === 'company_admin' ? 'Company Admin' : 'Field Engineer'}
            </p>
          </header>

          {loading ? (
            <div className="dashboard-empty">Loading profile...</div>
          ) : (
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
              <section className="dashboard-card">
                <div className="dashboard-section-header">
                  <h2 className="dashboard-section-title">Personal Details</h2>
                  <p className="dashboard-section-text">Your account overview and settings.</p>
                </div>
                
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '1.5rem' }}>
                  {sections.map((item) => (
                    <div key={item.label} className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '1.25rem', color: '#fff', fontWeight: '800' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)', marginTop: '1.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {user?.role === 'engineer' ? 'Bio' : 'Description'}
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: 'var(--text-2)', lineHeight: '1.6' }}>
                    {user?.role === 'engineer' 
                      ? (profile?.bio || 'No bio added yet.')
                      : (profile?.description || profile?.companyDesc || 'No description provided.')}
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileOverviewPage;
