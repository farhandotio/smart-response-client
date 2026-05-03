import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';
import heroImage from '../../../assets/hero-dashboard.png';

const Hero = () => {
  return (
    <section className="hero" id="product">
      <div className="hero-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content"
        >
          <div className="hero-badge">
             <span className="badge-tag">New</span>
             <span className="badge-text">v2.0 Staging now live</span>
             <ChevronRight size={14} />
          </div>
          
          <h1 className="hero-title">
            Autonomous <span className="text-gradient">Incident Response</span> for Modern Teams
          </h1>
          
          <p className="hero-description">
            SIRP AI monitors your entire infrastructure in real-time. 
            Detect, diagnose, and resolve anomalies before they impact your customers.
          </p>

          <div className="hero-btns">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register" 
              className="btn-primary"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#demo" 
              className="btn-secondary"
            >
              <Play size={18} fill="currentColor" />
              Watch Demo
            </motion.a>
          </div>

          <div className="hero-meta">
             <div className="meta-item">
                <strong>500+</strong>
                <span>Systems Monitored</span>
             </div>
             <div className="meta-divider" />
             <div className="meta-item">
                <strong>99.9%</strong>
                <span>Uptime Guaranteed</span>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="hero-visual"
        >
          <div className="glass-mockup">
             <div className="mockup-header">
                <div className="dots">
                    <span className="dot dot--red"></span>
                    <span className="dot dot--yellow"></span>
                    <span className="dot dot--green"></span>
                </div>
                <div className="address-bar">sirp-ai.command/dashboard</div>
             </div>
             <img src={heroImage} alt="SIRP AI Dashboard" />
             <div className="visual-glow"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
