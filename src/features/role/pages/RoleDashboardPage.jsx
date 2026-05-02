import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Activity, AlertTriangle, Cpu, Globe, Users, Settings, LayoutDashboard } from 'lucide-react';

const RoleDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loadMe, inviteMember, getWorkspaceData, getInvitations, acceptInvitation, loading } = useRoleActions();
  
  const [profile, setProfile] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    const meData = await loadMe();
    if (meData?.profile) setProfile(meData.profile);
    
    const wsData = await getWorkspaceData();
    if (wsData?.success) setWorkspace(wsData);

    const invData = await getInvitations();
    if (invData?.success) setInvitations(invData.invitations);
  };

  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.role) {
      navigate('/select-role');
      return;
    }

    fetchData();
  }, [user?.role, user?.isAuthenticated, navigate]);

  const isCompanyAdmin = user?.role === 'company_admin';
  const welcomeText = isCompanyAdmin ? 'Admin Command Center' : 'Engineer Tactical Hub';

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const success = await inviteMember(inviteEmail);
    if (success) {
        setInviteEmail('');
        fetchData(); // Refresh invitations list
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    const success = await acceptInvitation(inviteId);
    if (success) fetchData();
  };

  const statusCards = useMemo(() => [
    { title: 'System Health', value: '99.9%', note: 'Status: Nominal', status: 'good', icon: <Activity className="w-5 h-5" /> },
    { title: 'Active Incidents', value: '3', note: 'Critical: 1', status: 'warning', icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Log Ingestion', value: 'Active', note: 'Throughput: 1.2GB/s', status: 'good', icon: <Cpu className="w-5 h-5" /> },
  ], []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderOverview = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dashboard-grid dashboard-status-grid">
        {statusCards.map((item) => (
          <motion.div 
            key={item.title} 
            variants={cardVariants}
            whileHover={{ scale: 1.02, translateY: -5 }}
            className={`dashboard-card dashboard-status-card dashboard-status--${item.status}`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="dashboard-card-title">{item.title}</p>
              <span className={`status-icon status-icon--${item.status}`}>
                {item.icon}
              </span>
            </div>
            <strong className="status-value-text">{item.value}</strong>
            <p className="dashboard-card-text">{item.note}</p>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-row dashboard-bottom-row" style={{ marginTop: '2.5rem' }}>
        <motion.section variants={cardVariants} className="dashboard-card dashboard-incident-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Recent Alerts</h2>
            <p className="dashboard-section-text">Live feed of infrastructure anomalies.</p>
          </div>
          <div className="dashboard-incident-list">
              <div className="incident-row">
                <span className="incident-time">10:45</span>
                <div>
                  <p className="incident-title">API_LATENCY_SPIKE</p>
                  <p className="dashboard-card-text">Priority: High · Status: Investigating</p>
                </div>
              </div>
              <div className="incident-row">
                <span className="incident-time">09:12</span>
                <div>
                  <p className="incident-title">DB_CONNECTION_TIMEOUT</p>
                  <p className="dashboard-card-text">Priority: Critical · Status: Resolved</p>
                </div>
              </div>
          </div>
        </motion.section>

        <motion.section variants={cardVariants} className="dashboard-card dashboard-infra-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Infrastructure Topology</h2>
            <p className="dashboard-section-text">Live system health map.</p>
          </div>
          <div className="topology-placeholder">
            <div className="topology-chip">NODES ONLINE</div>
            <div className="topology-value">24 / 24</div>
            <div className="topology-location">Global Cluster — AWS/Azure</div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );

  const renderTeam = () => (
    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
      {isCompanyAdmin && (
        <section className="dashboard-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Invite Team</h2>
            <p className="dashboard-section-text">Add engineers to your workspace.</p>
          </div>
          <form onSubmit={handleInvite} className="auth-form" style={{ marginTop: '1.5rem', maxWidth: '500px' }}>
            <div className="auth-field">
              Email Address
              <input
                type="email"
                className="auth-input"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="engineer@company.com"
                required
              />
            </div>
            <button 
              type="submit" 
              className="auth-button auth-button--primary" 
              disabled={loading || !workspace?.company} 
              style={{ marginTop: '1rem' }}
            >
              {!workspace?.company ? 'Setup Workspace First' : (loading ? 'Sending...' : 'Send Invitation')}
            </button>
          </form>
        </section>
      )}

      <section className="dashboard-card">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">
            {isCompanyAdmin ? 'Sent Invitations' : 'Received Invitations'}
          </h2>
          <p className="dashboard-section-text">
            {isCompanyAdmin 
              ? 'Track the status of engineers you have invited.' 
              : 'Workspaces that have invited you to join their team.'}
          </p>
        </div>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '1.5rem' }}>
          {invitations.map((inv) => (
            <div key={inv._id} className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)', position: 'relative' }}>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>
                {isCompanyAdmin ? inv.email : inv.companyId?.name}
              </p>
              <p style={{ margin: '0.4rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                 {isCompanyAdmin ? `Status: ${inv.status}` : inv.companyId?.description}
              </p>
              {!isCompanyAdmin && inv.status === 'pending' && (
                <button 
                  onClick={() => handleAcceptInvite(inv._id)}
                  className="auth-button auth-button--primary" 
                  style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                >
                  Accept Invite
                </button>
              )}
              {isCompanyAdmin && (
                 <span className={`role-chip`} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', marginTop: 0 }}>
                   {inv.status}
                 </span>
              )}
            </div>
          ))}
          {invitations.length === 0 && (
            <div className="dashboard-empty" style={{ gridColumn: '1 / -1' }}>
              <p>No {isCompanyAdmin ? 'invitations sent' : 'invitations received'} yet.</p>
            </div>
          )}
        </div>
      </section>

      {isCompanyAdmin && workspace?.members?.length > 0 && (
        <section className="dashboard-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Active Team</h2>
            <p className="dashboard-section-text">Engineers currently in your workspace.</p>
          </div>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', marginTop: '1.5rem' }}>
            {workspace.members.map((member) => (
              <div key={member._id} className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <p style={{ margin: 0, fontWeight: '800' }}>{member.userId?.username || 'Unknown'}</p>
                <p style={{ margin: '0.2rem 0', color: 'var(--muted)', fontSize: '0.85rem' }}>{member.userId?.email || 'No email'}</p>
                <div style={{ marginTop: '1rem' }}>
                  <span className="role-chip" style={{ fontSize: '0.75rem' }}>{member.seniority || 'Engineer'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderWorkspace = () => (
    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
      <section className="dashboard-card">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Workspace Configuration</h2>
          <p className="dashboard-section-text">Infrastructure and team environment details.</p>
        </div>
        
        {workspace?.company ? (
          <div className="workspace-info" style={{ marginTop: '2rem' }}>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organization</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', color: '#fff', fontWeight: '800' }}>{workspace.company.name}</p>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)' }}>{workspace.company.description || 'Secure Incident Management Workspace'}</p>
              </div>
              
              <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Team Leadership</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '1.25rem', color: '#fff', fontWeight: '700' }}>{workspace.leader?.username || 'N/A'}</p>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--muted)', fontSize: '0.95rem' }}>{workspace.leader?.email}</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>Integrated Log Sources</p>
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {workspace.company.logSources?.map((s, i) => (
                  <div key={i} className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>{s.sourceName}</p>
                      <p style={{ margin: '0.3rem 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>{s.logUrl}</p>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', background: 'var(--accent)', borderRadius: '4px', color: '#000', fontWeight: '800', textTransform: 'uppercase' }}>{s.serviceType}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-empty" style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '2rem', color: 'var(--muted)', fontSize: '1.1rem' }}>
              {isCompanyAdmin 
                ? 'No workspace detected. Initialize your command center to begin.' 
                : 'You are currently unattached. Accept an invitation to join a tactical team.'}
            </p>
            {isCompanyAdmin && (
              <button 
                onClick={() => navigate(`/role/create/${user?.role}`)}
                className="auth-button auth-button--primary"
                style={{ width: 'auto', padding: '1rem 2.5rem' }}
              >
                Initialize Workspace
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="dashboard-main">
        <TopNav user={user} logout={logout} />
        
        <div className="dashboard-content">
          <header style={{ marginBottom: '2.5rem' }}>
            <p className="dashboard-label">{isCompanyAdmin ? 'Tactical Overview' : 'Operational Status'}</p>
            <h1 className="dashboard-title">{welcomeText}</h1>
          </header>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'workspace' && renderWorkspace()}
          
          {(activeTab === 'incidents' || activeTab === 'settings') && (
            <div className="dashboard-empty" style={{ background: 'rgba(255, 102, 51, 0.03)', border: '1px dashed var(--accent)', padding: '4rem 2rem' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800' }}>Module Under Construction</h2>
              <p style={{ color: 'var(--text-soft)', marginTop: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>This feature is currently being integrated into the SIRP Command Center.</p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <span className="topology-chip" style={{ background: 'rgba(255, 102, 51, 0.1)', color: 'var(--accent)' }}>DEVELOPMENT PHASE</span>
                <span className="topology-chip">V2.0 STAGING</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoleDashboardPage;
