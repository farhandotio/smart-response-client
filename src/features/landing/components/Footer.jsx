import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Twitter, 
  Github, 
  Linkedin, 
  Globe, 
  Mail,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Zap className="logo-icon" size={28} fill="var(--accent)" />
            <span>SIRP AI</span>
          </Link>
          <p>
            The world's most advanced autonomous incident response engine. 
            Empowering engineering teams to master infrastructure chaos.
          </p>
          <div className="socials">
            <motion.a whileHover={{ y: -3 }} href="#"><Globe size={20} /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#"><Twitter size={20} /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#"><Github size={20} /></motion.a>
            <motion.a whileHover={{ y: -3 }} href="#"><Linkedin size={20} /></motion.a>
          </div>
        </div>

        <div>
          <h4>Platform</h4>
          <ul>
            <li><Link to="/dashboard">Command Center</Link></li>
            <li><a href="#features">AI Diagnostics</a></li>
            <li><a href="#">Status Pages</a></li>
            <li><a href="#">Team Hub</a></li>
          </ul>
        </div>

        <div>
          <h4>Resources</h4>
          <ul>
            <li><Link to="/docs">Documentation</Link></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>

        <div className="newsletter">
          <h4>Stay Informed</h4>
          <p className="newsletter-text">Join 10,000+ engineers receiving our weekly reliability insights.</p>
          <div className="form-group">
            <input type="email" placeholder="Enter your email" />
            <button>
              Join
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © 2026 Smart Incident Response Platform. All rights reserved.
        </div>
        
        <div className="status-badge">
          <div className="dot"></div>
          <span>Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
