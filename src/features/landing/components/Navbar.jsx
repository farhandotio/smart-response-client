import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">
          <FiShield className="logo-icon" size={28} />
          <span>SIRP</span>
        </Link>
        
        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#resources">Resources</a>
          <Link to="/pricing">Pricing</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-start">Get Started</Link>
          <FiMenu className="mobile-menu" style={{ display: 'none' }} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
