import React from 'react';
import { FiHome, FiUsers, FiAlertCircle, FiSettings, FiBriefcase } from 'react-icons/fi';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const isAdmin = role === 'company_admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'incidents', label: 'Incidents', icon: <FiAlertCircle /> },
    { id: 'team', label: isAdmin ? 'Team Management' : 'My Team', icon: <FiUsers /> },
    { id: 'workspace', label: 'Workspace', icon: <FiBriefcase /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <span className="logo-icon">▲</span>
        <span className="logo-text">SIRP Tactical</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'nav-item--active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-profile">
          <div className="avatar">{isAdmin ? 'A' : 'E'}</div>
          <div className="info">
            <p className="name">User Hub</p>
            <p className="role">{isAdmin ? 'Administrator' : 'Engineer'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
