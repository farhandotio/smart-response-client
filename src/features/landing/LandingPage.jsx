import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Features from './components/Features';
import UnifiedCommand from './components/UnifiedCommand';
import Footer from './components/Footer';
import './styles/landing.scss';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.title = "SIRP AI | Autonomous Incident Response";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-container">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <UnifiedCommand />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
