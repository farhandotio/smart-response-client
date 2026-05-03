import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  Settings, 
  Briefcase, 
  Zap,
  ShieldCheck,
  Activity,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role, activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const isAdmin = role === 'company_admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertCircle size={20} /> },
    { id: 'team', label: isAdmin ? 'Team Management' : 'My Team', icon: <Users size={20} /> },
    { id: 'workspace', label: 'Workspace', icon: <Briefcase size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`dashboard-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <motion.div 
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              className="logo-icon-wrapper"
            >
              <Zap size={24} fill="var(--accent)" color="var(--accent)" />
            </motion.div>
            <span className="logo-text">SIRP <span style={{ color: 'var(--accent)' }}>AI</span></span>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`nav-item ${activeTab === item.id ? 'nav-item--active' : ''}`}
            onClick={() => {
              if (item.id === 'analytics') {
                navigate(isAdmin ? '/dashboard/company' : '/dashboard/engineer');
              } else {
                setActiveTab(item.id);
              }
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
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
    </>
  );
};

export default Sidebar;
