import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/auth.context';

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', to: '/docs' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAuthReady } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="logo">
          <div className="logo-mark">
            <Zap size={16} fill="var(--accent)" color="var(--accent)" />
          </div>
          <div className="logo-text max-md:hidden">
            SIRP <span className="text-accent">AI</span>
          </div>
        </Link>

        <div className="nav-links">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            )
          )}
        </div>

        <div className="nav-right">
          {isAuthReady && user?.isAuthenticated ? (
            <Link to="/dashboard" className="btn-fill">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="btn-fill">
                  Get Started <ArrowRight size={14} />
                </Link>
              </motion.div>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mob-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            {links.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              )
            )}
            <div className="mob-ctas">
              <Link to="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
