import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Features from './components/Features';
import UnifiedCommand from './components/UnifiedCommand';
import Footer from './components/Footer';
import './styles/landing.scss';

const LandingPage = () => {
  useEffect(() => {
    document.title = "SIRP | AI-Powered Incident Response";
  }, []);

  return (
    <div className="landing-container">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <UnifiedCommand />
      <Footer />
    </div>
  );
};

export default LandingPage;
