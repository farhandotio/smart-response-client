import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, LogOut, User, Command } from 'lucide-react';

const TopNav = ({ user, logout }) => {
  return (
    <header className="dashboard-topnav">
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search command center (Ctrl + K)" />
        <div className="command-hint">
            <Command size={12} />
            <span>K</span>
        </div>
      </div>
      
      <div className="nav-right">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="icon-btn"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </motion.button>
        
        <div className="profile-dropdown">
          <div className="profile-trigger">
            <div className="profile-info">
              <p className="username">{user?.username || 'User Hub'}</p>
              <p className="user-role">
                {user?.role === 'company_admin' ? 'Company Admin' : 'Field Engineer'}
              </p>
            </div>
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="avatar-circle"
            >
              <User size={20} />
            </motion.div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="logout-btn" 
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Exit</span>
        </motion.button>
      </div>
    </header>
  );
};

export default TopNav;
