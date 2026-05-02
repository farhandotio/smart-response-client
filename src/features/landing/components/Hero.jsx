import React from 'react';
import heroImage from '../../../assets/hero-dashboard.png';

const Hero = () => {
  return (
    <section className="hero" id="product">
      <div className="hero-content">
        <h1>Master the Chaos: AI-Powered Incident Response</h1>
        <p>
          SIRP centralizes tracking, automates postmortems, and keeps customers 
          informed with real-time intelligence and automated workflows. 
          Build trust through transparency and speed.
        </p>
        <div className="hero-btns">
          <a href="/register" className="btn-primary">Start Free Trial</a>
          <a href="#demo" className="btn-secondary">Book a Demo</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="mockup-container">
          <img src={heroImage} alt="SIRP Dashboard" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
