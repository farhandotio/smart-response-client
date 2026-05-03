import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  Settings, 
  Briefcase, 
  Zap,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const isAdmin = role === 'company_admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertCircle size={20} /> },
    { id: 'team', label: isAdmin ? 'Team Management' : 'My Team', icon: <Users size={20} /> },
    { id: 'workspace', label: 'Workspace', icon: <Briefcase size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <motion.div 
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          className="logo-icon-wrapper"
        >
          <Zap size={24} fill="var(--accent)" color="var(--accent)" />
        </motion.div>
        <span className="logo-text">SIRP <span style={{ color: 'var(--accent)' }}>AI</span></span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`nav-item ${activeTab === item.id ? 'nav-item--active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            style={{ position: 'relative' }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-nav"
                className="active-indicator"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="security-badge">
          <ShieldCheck size={14} />
          <span>System Secure</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
