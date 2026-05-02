import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', to: '/pricing' },
    { name: 'Docs', to: '/docs' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="logo">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="logo-icon-wrapper"
          >
            <Zap size={24} fill="var(--accent)" color="var(--accent)" />
          </motion.div>
          <span className="logo-text">SIRP <span style={{ color: 'var(--accent)' }}>AI</span></span>
        </Link>
        
        <div className="nav-links">
          {navLinks.map((link) => (
            link.to ? (
              <Link key={link.name} to={link.to}>{link.name}</Link>
            ) : (
              <a key={link.name} href={link.href}>{link.name}</a>
            )
          ))}
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-start">
            Get Started
            <ArrowRight size={16} />
          </Link>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu-overlay"
          >
             {navLinks.map((link) => (
               link.to ? (
                 <Link key={link.name} to={link.to} onClick={() => setMobileMenuOpen(false)}>{link.name}</Link>
               ) : (
                 <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}>{link.name}</a>
               )
             ))}
             <Link to="/login" className="mobile-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
             <Link to="/register" className="mobile-btn mobile-btn--primary" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
