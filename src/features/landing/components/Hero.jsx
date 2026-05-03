import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => (
  <section className="hero" id="product">
    <div className="hero-wrap">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        Autonomous <em className="grad-text">Incident Response</em> for Modern Teams
      </motion.h1>

      <motion.p
        className="hero-desc"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
      >
        SIRP AI monitors your entire infrastructure in real-time. Detect, diagnose, and resolve
        anomalies before they impact your customers.
      </motion.p>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/register" className="btn-primary">
          Start Free Trial <ArrowRight size={15} />
        </Link>
        <a href="#demo" className="btn-outline">
          <Play size={14} fill="currentColor" /> Watch Demo
        </a>
      </motion.div>

      <motion.div
        className="hero-stats"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="stat">
          <strong>500+</strong>
          <span>Systems Monitored</span>
        </div>
        <div className="divider" />
        <div className="stat">
          <strong>99.9%</strong>
          <span>Uptime SLA</span>
        </div>
        <div className="divider" />
        <div className="stat">
          <strong>4 min</strong>
          <span>Avg. MTTR</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
