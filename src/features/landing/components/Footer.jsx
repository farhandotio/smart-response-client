import React from 'react';
import { FiShield, FiTwitter, FiGithub, FiLinkedin, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <FiShield className="logo-icon" size={24} />
            <span>SIRP</span>
          </div>
          <p>
            Modern incident management for the next generation of reliable platforms. 
            Built by engineers, for engineers.
          </p>
          <div className="socials">
            <a href="#"><FiGlobe size={20} /></a>
            <a href="#"><FiTwitter size={20} /></a>
            <a href="#"><FiGithub size={20} /></a>
            <a href="#"><FiLinkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h4>Platform</h4>
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Automation</a></li>
            <li><a href="#">Status Pages</a></li>
            <li><a href="#">Integrations</a></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>

        <div className="newsletter">
          <h4>Newsletter</h4>
          <p>Stay updated with the latest in reliability engineering.</p>
          <div className="form-group">
            <input type="email" placeholder="email@company.com" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Smart Incident Response Platform. All rights reserved.</p>
        <div className="status">
          <div className="dot"></div>
          <span>System Status: Nominal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
