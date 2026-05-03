import React from 'react';
import { motion } from 'framer-motion';
import { Users, Cpu, Eye, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Users />,
      title: 'Tactical Collaboration',
      description: 'Real-time synchronization for engineering teams. Coordinate responses with sub-second latency powered by Socket.io.'
    },
    {
      icon: <Cpu />,
      title: 'AI Diagnostic Engine',
      description: 'Leverage Gemini 1.5 Pro to analyze logs instantly. Identify root causes and severity before your team even starts digging.'
    },
    {
      icon: <Eye />,
      title: 'Unified Monitoring',
      description: 'Centralize logs from VPS, Cloud, or Serverless. One command center to monitor your entire infrastructure health.'
    },
    {
      icon: <ShieldCheck />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption for all log data. Built-in compliance tools and audit trails for every incident resolved.'
    },
    {
      icon: <Zap />,
      title: 'Automated Workflows',
      description: 'Trigger automated postmortems and status updates. Reduce your MTTR by automating the repetitive response tasks.'
    },
    {
      icon: <BarChart3 />,
      title: 'System Intelligence',
      description: 'Deep analytics on incident trends. Identify weak points in your infrastructure with AI-generated health reports.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="features-section" id="features">
      <div className="section-header">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="section-tag"
        >
          Core Capabilities
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="section-title"
        >
          Engineered for <span className="text-gradient">High-Availability</span>
        </motion.h2>
        <p className="section-subtitle">
          Everything you need to master infrastructure chaos and build 
          unshakable trust with your customers.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="features-grid"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="feature-card-modern"
          >
            <div className="icon-wrapper">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
