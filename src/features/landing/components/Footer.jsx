import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Twitter, Github, Linkedin, Globe, ArrowRight } from 'lucide-react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <Link to="/" className="flogo">
          <div className="fmark">
            <Zap size={14} fill="var(--accent)" color="var(--accent)" />
          </div>
          SIRP<span>AI</span>
        </Link>
        <p>
          The world's most advanced autonomous incident response engine. Empowering engineering
          teams to master infrastructure chaos.
        </p>
        <div className="socials">
          {[Globe, Twitter, Github, Linkedin].map((Icon, i) => (
            <motion.a key={i} href="#" whileHover={{ y: -2 }}>
              <Icon size={14} />
            </motion.a>
          ))}
        </div>
      </div>

      <div className="fcol">
        <h4>Platform</h4>
        <ul>
          <li>
            <Link to="/dashboard">Command Center</Link>
          </li>
          <li>
            <a href="#features">AI Diagnostics</a>
          </li>
          <li>
            <a href="#">Status Pages</a>
          </li>
          <li>
            <a href="#">Team Hub</a>
          </li>
        </ul>
      </div>

      <div className="fcol">
        <h4>Resources</h4>
        <ul>
          <li>
            <Link to="/docs">Documentation</Link>
          </li>
          <li>
            <a href="#">API Reference</a>
          </li>
          <li>
            <a href="#">Security</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
        </ul>
      </div>

      <div className="fnewsletter">
        <h4>Stay Informed</h4>
        <p>Join 10,000+ engineers receiving our weekly reliability insights.</p>
        <div className="email-form">
          <input type="email" placeholder="your@email.com" />
          <button type="button">
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>

    <div className="footer-btm">
      <span className='text'>© 2026 SIRP AI. All rights reserved.</span>
      <div className="status">
        <div className="pulse" />
        Systems Operational
      </div>
    </div>
  </footer>
);

export default Footer;
