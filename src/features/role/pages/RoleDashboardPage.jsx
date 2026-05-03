import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Activity, AlertTriangle, Cpu, Globe, Users, Settings, LayoutDashboard, X } from 'lucide-react';
import { socket, connectSocket, disconnectSocket } from '../../../config/socket';

const IncidentRow = ({ inc, isExpanded, onToggle, onUpdateStatus, onAssign, onUnassign, loading, currentUserId, isAdmin, allEngineers }) => {
  const [newStatus, setNewStatus] = useState(inc.status);
  const [resolution, setResolution] = useState(inc.resolutionSummary || '');

  const isAssignedToMe = inc.assignedEngineers?.some(e => e._id === currentUserId);

  const handleSubmit = (e) => {
    e.stopPropagation();
    onUpdateStatus(inc._id, newStatus, resolution);
  };

  const handleClaim = (e) => {
    e.stopPropagation();
    onAssign(inc._id);
  };

  const handleSelectAssign = (e) => {
    const engineerId = e.target.value;
    if (engineerId) {
      onAssign(inc._id, engineerId);
    }
  };

  const handleUnassign = (e, engineerId) => {
    e.stopPropagation();
    onUnassign(inc._id, engineerId);
  };

  return (
    <React.Fragment>
      <tr 
        onClick={onToggle}
        style={{ 
          borderBottom: '1px solid var(--line-hi)', 
          cursor: 'pointer', 
          transition: 'background 0.2s',
          background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
        }}
        className="incident-row-hover"
      >
        <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{inc.title}</td>
        <td style={{ padding: '1rem 0.5rem' }}>
          <span className="topology-chip" style={{ background: inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-1)', color: inc.severity === 'critical' ? '#ef4444' : 'var(--text)', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
            {inc.severity?.toUpperCase() || 'UNKNOWN'}
          </span>
        </td>
        <td style={{ padding: '1rem 0.5rem' }}>
          <span style={{ 
            color: inc.status === 'resolved' ? '#22c55e' : (inc.status === 'investigating' ? '#f59e0b' : '#ef4444'),
            fontWeight: '600'
          }}>
            {inc.status?.toUpperCase() || 'OPEN'}
          </span>
        </td>
        <td style={{ padding: '1rem 0.5rem', color: 'var(--text-3)' }}>
          {inc.assignedEngineers?.map(e => e.username).join(', ') || 'Unassigned'}
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr>
            <td colSpan="4" style={{ padding: 0 }}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--line-hi)', background: 'rgba(255,255,255,0.01)' }}>
                  <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</p>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: '1.6' }}>{inc.description || 'No description provided.'}</p>
                      
                      <p style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.75rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase' }}>Affected Services</p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {inc.affectedServices?.map((service, idx) => (
                          <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-1)', border: '1px solid var(--line-hi)', borderRadius: 'var(--r)' }}>{service}</span>
                        )) || 'None'}
                      </div>
                    </div>
                    <div>
                      {(isAdmin || isAssignedToMe) && (
                        <>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Update Status</p>
                          <div className="auth-form" style={{ marginTop: '0.5rem' }}>
                            <select 
                              className="auth-input" 
                              value={newStatus} 
                              onChange={(e) => setNewStatus(e.target.value)}
                              style={{ marginBottom: '0.8rem', padding: '0.5rem' }}
                            >
                              <option value="open">Open</option>
                              <option value="investigating">Investigating</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <textarea 
                              className="auth-input" 
                              value={resolution} 
                              onChange={(e) => setResolution(e.target.value)}
                              placeholder="Resolution summary..."
                              style={{ minHeight: '80px', fontSize: '0.9rem', marginBottom: '0.8rem' }}
                            />
                            <button 
                              onClick={handleSubmit} 
                              className="auth-button auth-button--primary" 
                              disabled={loading}
                              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                              {loading ? 'Updating...' : 'Update Incident'}
                            </button>
                          </div>
                        </>
                      )}

                      <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Team</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {inc.assignedEngineers?.map(eng => (
                            <div key={eng._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.8rem', borderRadius: 'var(--r)', border: '1px solid var(--line-hi)' }}>
                              <div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: '700' }}>{eng.username}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-3)' }}>{eng.email}</p>
                              </div>
                              {isAdmin && (
                                <button 
                                  onClick={(e) => handleUnassign(e, eng._id)}
                                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          {inc.assignedEngineers?.length === 0 && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)' }}>No engineers assigned.</p>}
                        </div>

                        {isAdmin && (
                          <div style={{ marginTop: '1rem' }}>
                            <select 
                              className="auth-input" 
                              onChange={handleSelectAssign} 
                              value=""
                              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                            >
                              <option value="">+ Assign Team Member</option>
                              {allEngineers?.filter(eng => !inc.assignedEngineers?.some(e => e._id === eng._id))
                                .map(eng => (
                                  <option key={eng._id} value={eng._id}>{eng.username} ({eng.email})</option>
                                ))
                              }
                            </select>
                          </div>
                        )}
                      </div>

                      {!isAssignedToMe && !isAdmin && (
                        <div style={{ marginTop: '1.5rem' }}>
                          <button 
                            onClick={handleClaim}
                            className="auth-button auth-button--secondary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', background: 'rgba(255, 102, 51, 0.1)', borderColor: 'var(--accent)' }}
                          >
                            Claim this Incident
                          </button>
                        </div>
                      )}

                      <p style={{ margin: '1.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                        Created: {new Date(inc.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

const RoleDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    loadMe, 
    getWorkspaceData, 
    getInvitations, 
    acceptInvitation, 
    inviteMember, 
    kickMember, 
    updateCompany,
    getIncidents,
    updateIncidentStatus,
    triggerManualScan,
    assignEngineer,
    unassignEngineer,
    loading 
  } = useRoleActions();

  const handleUpdateStatus = async (id, status, resolutionSummary) => {
    const success = await updateIncidentStatus(id, status, resolutionSummary);
    if (success) {
      fetchIncidents(); // Refresh incidents list
    }
  };

  const handleAssign = async (id, engineerId) => {
    const success = await assignEngineer(id, engineerId);
    if (success) {
      fetchIncidents();
    }
  };

  const handleUnassign = async (id, engineerId) => {
    if (!window.confirm("Remove this engineer from this incident?")) return;
    const success = await unassignEngineer(id, engineerId);
    if (success) {
      fetchIncidents();
    }
  };
  
  const [profile, setProfile] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editCompanySlug, setEditCompanySlug] = useState('');
  const [editCompanyDesc, setEditCompanyDesc] = useState('');
  const [editCompanyLogo, setEditCompanyLogo] = useState(null);
  const [editCompanyLogSources, setEditCompanyLogSources] = useState([]);

  const [incidentsData, setIncidentsData] = useState({ incidents: [], total: 0, page: 1, pages: 1 });
  const [incidentFilters, setIncidentFilters] = useState({ status: 'all', severity: 'all', page: 1 });
  const [expandedIncidentId, setExpandedIncidentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Socket.io for real-time updates
  useEffect(() => {
    if (workspace?.company?._id) {
      connectSocket(workspace.company._id);

      socket.on('new-incident', (data) => {
        const newInc = data.data;
        toast.error(`🚨 NEW CRITICAL ALERT: ${newInc.title}`, {
          position: "top-right",
          autoClose: 10000,
        });
        
        // Update state directly for true real-time feel
        setIncidentsData(prev => ({
          ...prev,
          incidents: [newInc, ...prev.incidents].slice(0, 10), // Keep it within limit
          total: prev.total + 1
        }));
      });

      socket.on('incident-updated', (data) => {
        const { incidentId, newStatus, message } = data;
        
        if (newStatus === 'open' && message?.includes('RE-OPENED')) {
          toast.warning(`⚠️ INCIDENT RE-OPENED: ${message}`);
        } else {
          toast.info(`Incident status updated to ${newStatus?.toUpperCase()}`);
        }

        // Update state directly
        setIncidentsData(prev => ({
          ...prev,
          incidents: prev.incidents.map(inc => 
            inc._id === incidentId ? { ...inc, status: newStatus } : inc
          )
        }));
      });

      return () => {
        socket.off('new-incident');
        socket.off('incident-updated');
        disconnectSocket();
      };
    }
  }, [workspace?.company?._id]);

  const fetchData = async () => {
    const meData = await loadMe();
    if (meData?.profile) setProfile(meData.profile);
    
    const wsData = await getWorkspaceData();
    if (wsData?.success) setWorkspace(wsData);

    const invData = await getInvitations();
    if (invData?.success) setInvitations(invData.invitations);

    const incData = await getIncidents({ limit: 5 }); // Fetch recent 5 for overview
    if (incData?.success) setIncidentsData(incData);
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

  const fetchIncidents = async () => {
    const data = await getIncidents(incidentFilters);
    if (data?.success) setIncidentsData(data);
  };

  useEffect(() => {
    if (activeTab === 'incidents') {
      fetchIncidents();
    }
  }, [activeTab, incidentFilters]);

  const isCompanyAdmin = user?.role === 'company_admin';
  const welcomeText = isCompanyAdmin ? 'Administrator Workspace' : 'Engineering Dashboard';

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

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editCompanyName) formData.append('name', editCompanyName);
    if (editCompanySlug) formData.append('slug', editCompanySlug);
    if (editCompanyDesc !== undefined) formData.append('description', editCompanyDesc);
    if (editCompanyLogo) formData.append('image', editCompanyLogo);
    formData.append('logSources', JSON.stringify(editCompanyLogSources));

    const success = await updateCompany(formData);
    if (success) {
      setIsEditingCompany(false);
      fetchData();
    }
  };

  const handleKickMember = async (engineerId) => {
    if (!window.confirm("Are you sure you want to remove this engineer?")) return;
    const success = await kickMember(engineerId);
    if (success) fetchData();
  };

  const statusCards = useMemo(() => [
    { title: 'System Health', value: 'Nominal', note: 'All systems operational', status: 'good', icon: <Activity className="w-5 h-5" /> },
    { title: 'Active Incidents', value: incidentsData.total.toString(), note: `Unresolved: ${incidentsData.incidents.filter(i => i.status !== 'resolved').length}`, status: incidentsData.incidents.some(i => i.severity === 'critical') ? 'critical' : (incidentsData.total > 0 ? 'warning' : 'good'), icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Team Size', value: (workspace?.members?.length || 0).toString(), note: `Pending invites: ${invitations.filter(i => i.status === 'pending').length}`, status: 'good', icon: <Users className="w-5 h-5" /> },
  ], [incidentsData, workspace, invitations]);

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
            {incidentsData.incidents.slice(0, 4).map((inc) => (
              <div key={inc._id} className="incident-row" onClick={() => { setActiveTab('incidents'); setExpandedIncidentId(inc._id); }} style={{ cursor: 'pointer' }}>
                <span className="incident-time">{new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div>
                  <p className="incident-title">{inc.title}</p>
                  <p className="dashboard-card-text">
                    Severity: <span style={{ color: inc.severity === 'critical' ? '#ef4444' : 'var(--text-2)' }}>{inc.severity?.toUpperCase()}</span> · Status: {inc.status}
                  </p>
                </div>
              </div>
            ))}
            {incidentsData.incidents.length === 0 && (
              <p className="dashboard-section-text" style={{ padding: '1rem', textAlign: 'center' }}>No recent incidents detected.</p>
            )}
          </div>
        </motion.section>

        <motion.section variants={cardVariants} className="dashboard-card dashboard-infra-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">System Overview</h2>
            <p className="dashboard-section-text">Live system health map.</p>
          </div>
          <div className="topology-placeholder">
            <div className="topology-chip">ACTIVE CONNECTIONS</div>
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
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', marginTop: '1.5rem' }}>
          {invitations.map((inv) => (
            <div key={inv._id} className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.03)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ paddingRight: isCompanyAdmin ? '5rem' : '0' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                  {isCompanyAdmin ? inv.email : inv.companyId?.name}
                </p>
                <p style={{ margin: '0.4rem 0', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                   {isCompanyAdmin ? `Status: ${inv.status}` : inv.companyId?.description}
                </p>
              </div>
              {!isCompanyAdmin && inv.status === 'pending' && (
                <button 
                  onClick={() => handleAcceptInvite(inv._id)}
                  className="auth-button auth-button--primary" 
                  style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', width: '100%' }}
                >
                  Accept Invite
                </button>
              )}
              {isCompanyAdmin && (
                 <span className={`role-chip`} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', marginTop: 0, fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
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

      {workspace?.members?.length > 0 && (
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
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="role-chip" style={{ fontSize: '0.75rem', marginTop: 0 }}>{member.seniority || 'Engineer'}</span>
                  {isCompanyAdmin && (
                    <button 
                      onClick={() => handleKickMember(member.userId._id)}
                      style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: 'var(--r)', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderWorkspace = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="workspace-container"
    >
      <section className="dashboard-card workspace-main-card" style={{ padding: '2rem' }}>
        <div className="workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--line-hi)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h2 className="dashboard-section-title" style={{ fontSize: '1.8rem' }}>Workspace Configuration</h2>
            <p className="dashboard-section-text" style={{ fontSize: '1rem' }}>Manage your organization's infrastructure and team environment.</p>
          </div>
          {isCompanyAdmin && workspace?.company && (
            <button 
              onClick={() => {
                setEditCompanyName(workspace.company.name);
                setEditCompanySlug(workspace.company.slug || '');
                setEditCompanyDesc(workspace.company.description || '');
                setEditCompanyLogSources(workspace.company.logSources ? [...workspace.company.logSources] : []);
                setEditCompanyLogo(null);
                setIsEditingCompany(!isEditingCompany);
              }}
              className={`auth-button ${isEditingCompany ? 'auth-button--secondary' : 'auth-button--primary'}`}
              style={{ width: 'auto', padding: '0.6rem 1.5rem' }}
            >
              {isEditingCompany ? 'Cancel Editing' : 'Edit Workspace'}
            </button>
          )}
        </div>
        
        {!workspace?.company ? (
          <div className="dashboard-empty" style={{ padding: '4rem 0' }}>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-3)' }}>No workspace detected. Initialize your organization to begin monitoring.</p>
            {isCompanyAdmin && (
              <button onClick={() => navigate(`/role/create/${user?.role}`)} className="auth-button auth-button--primary" style={{ width: 'auto', padding: '1rem 3rem' }}>Initialize Workspace</button>
            )}
          </div>
        ) : isEditingCompany ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleUpdateCompany} 
            className="workspace-edit-form"
          >
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="edit-section">
                <p className="form-section-title" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Basic Identity</p>
                <div className="auth-field" style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>Organization Name</label>
                  <input className="auth-input" value={editCompanyName} onChange={e => setEditCompanyName(e.target.value)} required placeholder="e.g. Acme Corp" />
                </div>
                <div className="auth-field" style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>URL Slug</label>
                  <input className="auth-input" value={editCompanySlug} onChange={e => setEditCompanySlug(e.target.value)} placeholder="acme-corp" />
                </div>
                <div className="auth-field" style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>Logo & Branding</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: 'var(--r)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={24} color="var(--text-3)" />
                    </div>
                    <input type="file" className="auth-input" style={{ flex: 1 }} onChange={e => setEditCompanyLogo(e.target.files[0])} accept="image/*" />
                  </div>
                </div>
              </div>
              <div className="edit-section">
                <p className="form-section-title" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>About & Mission</p>
                <div className="auth-field">
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '0.5rem' }}>Description</label>
                  <textarea className="auth-input" style={{ minHeight: '160px' }} value={editCompanyDesc} onChange={e => setEditCompanyDesc(e.target.value)} placeholder="Describe your organization's mission..." />
                </div>
              </div>
            </div>

            <div className="edit-section" style={{ marginTop: '2rem', borderTop: '1px solid var(--line-hi)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p className="form-section-title" style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase' }}>Log Monitoring Sources</p>
                <button type="button" onClick={() => setEditCompanyLogSources([...editCompanyLogSources, { sourceName: '', logUrl: '', serviceType: 'backend' }])} className="auth-button auth-button--secondary" style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Add Source</button>
              </div>
              
              <div className="log-sources-edit-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {editCompanyLogSources.map((source, idx) => (
                  <motion.div 
                    layout
                    key={idx} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 2fr 1fr auto', 
                      gap: '1rem', 
                      background: 'rgba(255,255,255,0.02)', 
                      padding: '1rem', 
                      borderRadius: 'var(--r)',
                      alignItems: 'center'
                    }}
                    className="log-source-edit-item"
                  >
                    <input className="auth-input" placeholder="Name" value={source.sourceName} onChange={e => {
                      const newSources = [...editCompanyLogSources];
                      newSources[idx].sourceName = e.target.value;
                      setEditCompanyLogSources(newSources);
                    }} required />
                    <input className="auth-input" placeholder="Endpoint URL" value={source.logUrl} onChange={e => {
                      const newSources = [...editCompanyLogSources];
                      newSources[idx].logUrl = e.target.value;
                      setEditCompanyLogSources(newSources);
                    }} required />
                    <select className="auth-input" value={source.serviceType} onChange={e => {
                      const newSources = [...editCompanyLogSources];
                      newSources[idx].serviceType = e.target.value;
                      setEditCompanyLogSources(newSources);
                    }}>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                    </select>
                    <button type="button" onClick={() => setEditCompanyLogSources(editCompanyLogSources.filter((_, i) => i !== idx))} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: 'var(--r)', cursor: 'pointer' }}><X size={18} /></button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
               <button type="submit" className="auth-button auth-button--primary" disabled={loading} style={{ width: 'auto', padding: '1rem 4rem' }}>{loading ? 'Saving Changes...' : 'Save Configuration'}</button>
            </div>
          </motion.form>
        ) : (
          <div className="workspace-view">
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="workspace-card-premium" style={{ background: 'linear-gradient(135deg, rgba(255,102,51,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid var(--line-hi)', borderRadius: 'var(--r-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {workspace.company.logo ? (
                      <img src={workspace.company.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: 'var(--r-lg)', objectFit: 'cover', border: '2px solid var(--line-hi)' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: 'var(--r-lg)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '2px dashed var(--line-hi)' }}>
                        <Globe size={32} />
                      </div>
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' }}>{workspace.company.name}</h3>
                      <p style={{ margin: '0.2rem 0 0', color: 'var(--accent-soft)', fontSize: '0.9rem', fontWeight: '600' }}>/{workspace.company.slug}</p>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>{workspace.company.description || 'Enterprise-grade incident response environment.'}</p>
                </div>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line-hi)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    className="auth-button auth-button--secondary" 
                    style={{ width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                    onClick={async () => {
                      const success = await triggerManualScan();
                      if (success) fetchData();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Manual AI Scan'}
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: '600' }}>Last Scan: Just now</span>
                </div>
              </div>

              <div className="leadership-card-premium" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line-hi)', borderRadius: 'var(--r-lg)', padding: '2rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-soft)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Leadership Team</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent) 0%, #ff8c66 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', fontSize: '1.2rem' }}>
                    {workspace.leader?.username?.[0]?.toUpperCase() || 'L'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: '800' }}>{workspace.leader?.username}</p>
                    <p style={{ margin: '0.1rem 0 0', color: 'var(--text-3)', fontSize: '0.9rem' }}>{workspace.leader?.email}</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '2.5rem' }}>
                   <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: '600' }}>Security Clearances</p>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="role-chip" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>Platform Admin</span>
                      <span className="role-chip" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Root Access</span>
                   </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: '800' }}>Integrated Log Sources</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>{workspace.company.logSources?.length || 0} active integrations</span>
              </div>
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {workspace.company.logSources?.map((s, i) => (
                  <motion.div 
                    whileHover={{ translateY: -5 }}
                    key={i} 
                    className="log-source-premium" 
                    style={{ 
                      background: 'var(--bg-1)', 
                      border: '1px solid var(--line-hi)', 
                      borderRadius: 'var(--r)', 
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Cpu size={18} color="var(--accent)" />
                          </div>
                          <p style={{ margin: 0, color: '#fff', fontWeight: '800', fontSize: '1.05rem' }}>{s.sourceName}</p>
                       </div>
                       <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line-hi)', borderRadius: '4px', color: 'var(--text-3)', fontWeight: '800', textTransform: 'uppercase' }}>{s.serviceType}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.85rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.logUrl}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role} activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="dashboard-main">
        <TopNav user={user} logout={logout} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="dashboard-content">
          <header style={{ marginBottom: '2.5rem' }}>
            <p className="dashboard-label">{isCompanyAdmin ? 'Workspace Overview' : 'System Status'}</p>
            <h1 className="dashboard-title">{welcomeText}</h1>
          </header>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'workspace' && renderWorkspace()}
          
          {activeTab === 'incidents' && (
            <div className="dashboard-card">
              <div className="dashboard-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="dashboard-section-title">Incidents Ledger</h2>
                  <p className="dashboard-section-text">Track and resolve active system alerts.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select className="auth-input" style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem' }} value={incidentFilters.status} onChange={(e) => setIncidentFilters({ ...incidentFilters, status: e.target.value, page: 1 })}>
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select className="auth-input" style={{ width: 'auto', padding: '0.5rem 2.5rem 0.5rem 1rem' }} value={incidentFilters.severity} onChange={(e) => setIncidentFilters({ ...incidentFilters, severity: e.target.value, page: 1 })}>
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line-hi)', color: 'var(--text-3)' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>Title</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Severity</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentsData.incidents.map((inc) => (
                      <IncidentRow 
                        key={inc._id}
                        inc={inc}
                        isExpanded={expandedIncidentId === inc._id}
                        onToggle={() => setExpandedIncidentId(expandedIncidentId === inc._id ? null : inc._id)}
                        onUpdateStatus={handleUpdateStatus}
                        onAssign={handleAssign}
                        onUnassign={handleUnassign}
                        currentUserId={user?.id}
                        isAdmin={isCompanyAdmin}
                        allEngineers={workspace?.members}
                        loading={loading}
                      />
                    ))}
                  </tbody>
                </table>
                {incidentsData.incidents.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: '2rem' }}>No incidents found.</p>
                )}
              </div>

              {incidentsData.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    disabled={incidentsData.page === 1}
                    onClick={() => setIncidentFilters({ ...incidentFilters, page: incidentsData.page - 1 })}
                    className="auth-button auth-button--secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'var(--text-3)' }}>Page {incidentsData.page} of {incidentsData.pages}</span>
                  <button 
                    disabled={incidentsData.page === incidentsData.pages}
                    onClick={() => setIncidentFilters({ ...incidentFilters, page: incidentsData.page + 1 })}
                    className="auth-button auth-button--secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="dashboard-empty" style={{ background: 'rgba(255, 102, 51, 0.03)', border: '1px dashed var(--accent)', padding: '4rem 2rem' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800' }}>Feature in Development</h2>
              <p style={{ color: 'var(--text-soft)', marginTop: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>This functionality is currently being implemented for the next release.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoleDashboardPage;
