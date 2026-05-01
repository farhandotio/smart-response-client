import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';

const RoleDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, setMessage } = useAuth();
  const { loadMe, loading } = useRoleActions();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.role) {
      navigate('/select-role');
      return;
    }

    if (profile) return;

    const fetchProfile = async () => {
      const data = await loadMe();
      if (data?.profile) setProfile(data.profile);
    };

    fetchProfile();
  }, [user?.role, user?.isAuthenticated, profile, navigate, loadMe]);

  useEffect(() => {
    setMessage('');
  }, [setMessage]);

  const role = user?.role;
  const location = useLocation();
  const welcomeText = role === 'developer' ? 'Tactical Overview' : 'Client Command Center';

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Profile Overview', path: '/dashboard/profile' },
  ];

  const activeNav = (path) => location.pathname === path;

  const statusCards = useMemo(() => {
    if (role === 'developer') {
      return [
        { title: 'Connectivity', value: '98.2%', note: 'Status: Nominal', status: 'good' },
        { title: 'Cloud Sync', value: 'Degraded', note: 'Latency: +450ms', status: 'warning' },
        { title: 'Backup Mode', value: 'Offline', note: 'Re-routing required', status: 'critical' },
      ];
    }

    return [
      { title: 'Requests', value: '12', note: 'Pending review', status: 'good' },
      { title: 'Proposals', value: '4', note: 'Awaiting responses', status: 'warning' },
      { title: 'Invoices', value: '2', note: 'Overdue complete', status: 'critical' },
    ];
  }, [role]);

  const resourceItems = useMemo(() => {
    if (role === 'developer') {
      return [
        { label: 'Compute Load', value: 68, note: 'High activity detected' },
        { label: 'Throughput', value: 74, note: 'Peak traffic active' },
        { label: 'Storage Cap', value: 89, note: 'Warning: storage nearing threshold' },
      ];
    }

    return [
      { label: 'Budget Usage', value: 54, note: 'Allocated vs spent' },
      { label: 'Project Delivery', value: 62, note: 'On schedule' },
      { label: 'Vendor Reach', value: 77, note: 'Current network coverage' },
    ];
  }, [role]);

  const incidentItems = useMemo(() => {
    if (role === 'developer') {
      return [
        { time: '14:18', title: 'Auth_Server_Timestamp', status: 'resolved', priority: 'High' },
        { time: '14:02', title: 'Packet_Loss_Spike', status: 'in progress', priority: 'Mid' },
        { time: '13:42', title: 'Database_Latency_Alert', status: 'open', priority: 'Low' },
      ];
    }

    return [
      { time: '09:45', title: 'New proposal received', status: 'new', priority: 'Medium' },
      { time: '10:12', title: 'Invoice approved', status: 'completed', priority: 'Low' },
      { time: '11:00', title: 'Contract milestone due', status: 'action', priority: 'High' },
    ];
  }, [role]);

  const ledgerPanel = useMemo(() => {
    if (role === 'developer') {
      return {
        title: 'Revenue Ledger',
        amount: '$12,450.00',
        footer: 'Next payout scheduled for 2026-05-15',
        action: 'View statement',
      };
    }

    return {
      title: 'Client Ledger',
      amount: '$24,800.00',
      footer: 'Available budget through 2026-06-01',
      action: 'Review spending',
    };
  }, [role]);

  const renderProfileOverview = () => {
    if (!profile) {
      return <div className="dashboard-empty">No profile details available yet.</div>;
    }

    if (role === 'developer') {
      return (
        <div className="dashboard-grid dashboard-overview-grid">
          <div className="dashboard-card">
            <p className="dashboard-card-title">Experience</p>
            <strong>{profile.experienceYears || 'N/A'} years</strong>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Tech Stack</p>
            <strong>{profile.techStack?.join(', ') || 'N/A'}</strong>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Rate Range</p>
            <strong>${profile.rateMin || 'N/A'} - ${profile.rateMax || 'N/A'}</strong>
          </div>
          <div className="dashboard-card dashboard-card--wide">
            <p className="dashboard-card-title">Portfolio</p>
            <p>{profile.portfolioLink || 'Not provided'}</p>
          </div>
          <div className="dashboard-card dashboard-card--wide">
            <p className="dashboard-card-title">Bio</p>
            <p>{profile.bio || 'No bio added yet.'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-grid dashboard-overview-grid">
        <div className="dashboard-card">
          <p className="dashboard-card-title">Company</p>
          <strong>{profile.companyName || 'N/A'}</strong>
        </div>
        <div className="dashboard-card dashboard-card--wide">
          <p className="dashboard-card-title">Description</p>
          <p>{profile.companyDesc || 'No company description yet.'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-panel">
        <div className="dashboard-head">
          <div>
            <p className="dashboard-label">{role === 'developer' ? 'Tactical Overview' : 'Command Center'}</p>
            <h1 className="dashboard-title">{welcomeText}</h1>
            <p className="dashboard-subtitle">Logged in as {user?.username || 'User'}</p>
          </div>
          <div className="role-actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/select-role')}>
              Change Role
            </button>
            <button type="button" className="outline-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`dashboard-nav-item ${activeNav(item.path) ? 'dashboard-nav-item--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="dashboard-grid dashboard-status-grid">
          {statusCards.map((item) => (
            <div key={item.title} className={`dashboard-card dashboard-status-card dashboard-status--${item.status}`}>
              <p className="dashboard-card-title">{item.title}</p>
              <strong>{item.value}</strong>
              <p className="dashboard-card-text">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="dashboard-row">
          <section className="dashboard-card dashboard-board-card">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Resource gauges</h2>
              <p className="dashboard-section-text">System metrics and capacity tracking.</p>
            </div>
            {resourceItems.map((item) => (
              <div key={item.label} className="dashboard-progress-item">
                <div className="dashboard-progress-title">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="dashboard-progress-bar">
                  <div className="dashboard-progress-fill" style={{ width: `${item.value}%` }} />
                </div>
                <p className="dashboard-card-text">{item.note}</p>
              </div>
            ))}
          </section>

          <aside className="dashboard-card dashboard-ledger-card">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">{ledgerPanel.title}</h2>
              <p className="dashboard-section-text">Financial summary and next action.</p>
            </div>
            <div className="ledger-amount">{ledgerPanel.amount}</div>
            <p className="dashboard-card-text">{ledgerPanel.footer}</p>
            <button type="button" className="auth-button auth-button--primary dashboard-action-button">
              {ledgerPanel.action}
            </button>
          </aside>
        </div>

        <div className="dashboard-row dashboard-bottom-row">
          <section className="dashboard-card dashboard-incident-card">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Incident timeline</h2>
              <p className="dashboard-section-text">Recent alerts and task tracking.</p>
            </div>
            <div className="dashboard-incident-list">
              {incidentItems.map((item) => (
                <div key={item.time + item.title} className="incident-row">
                  <span className="incident-time">{item.time}</span>
                  <div>
                    <p className="incident-title">{item.title}</p>
                    <p className="dashboard-card-text">{item.priority} priority · {item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-card dashboard-infra-card">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Infrastructure topology</h2>
              <p className="dashboard-section-text">Live system health and network map.</p>
            </div>
            <div className="topology-placeholder">
              <div className="topology-chip">ACTIVE NODES</div>
              <div className="topology-value">12 / 14</div>
              <div className="topology-location">Central Hub — Neo Tokyo</div>
            </div>
          </section>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Profile overview</h2>
            <p className="dashboard-section-text">Your current profile settings and role-specific details.</p>
          </div>
          {loading ? (
            <div className="auth-output">Loading dashboard...</div>
          ) : (
            renderProfileOverview()
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleDashboardPage;
