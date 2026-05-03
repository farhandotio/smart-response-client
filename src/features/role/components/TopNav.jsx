import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ user, logout, onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="dashboard-topnav">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div className="nav-right" style={{ marginLeft: 'auto', position: 'relative' }} ref={dropdownRef}>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="avatar-circle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer', background: isOpen ? 'var(--bg-1)' : 'transparent' }}
        >
          <User size={20} />
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="profile-dropdown-menu"
            >
              <div className="dropdown-header">
                <p className="dropdown-name">{user?.username || 'User'}</p>
                <p className="dropdown-email">{user?.email || ''}</p>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => { setIsOpen(false); navigate('/dashboard/profile'); }}>
                <User size={16} /> Profile
              </button>
              <button className="dropdown-item logout-item" onClick={() => { setIsOpen(false); logout(); }}>
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default TopNav;
