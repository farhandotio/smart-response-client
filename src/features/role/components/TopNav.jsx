import React from 'react';
import { FiSearch, FiBell, FiLogOut, FiUser } from 'react-icons/fi';

const TopNav = ({ user, logout }) => {
  return (
    <header className="dashboard-topnav">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search incidents, logs, or team..." />
      </div>
      
      <div className="nav-right">
        <button className="icon-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>
        
        <div className="profile-dropdown">
          <div className="profile-trigger">
            <div className="profile-info">
              <p className="username">{user?.username}</p>
              <p className="user-role">{user?.role === 'company_admin' ? 'Company Admin' : 'Field Engineer'}</p>
            </div>
            <div className="avatar-circle">
              <FiUser />
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={logout} title="Logout">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
