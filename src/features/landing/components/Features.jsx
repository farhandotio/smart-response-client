import React from 'react';
import { FiUsers, FiCpu, FiEye } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiUsers />,
      title: 'Real-time Collaboration',
      description: 'Live updates powered by Socket.io ensuring your team stays synchronized during critical events. See teammate actions instantly.'
    },
    {
      icon: <FiCpu />,
      title: 'AI-Driven Postmortems',
      description: 'Automated root cause analysis using GPT-4 to generate detailed insights, timelines, and action items to prevent future downtime.'
    },
    {
      icon: <FiEye />,
      title: 'Public Transparency',
      description: 'Integrated status pages that sync directly with your internal incidents. Build customer trust through proactive communication.'
    }
  ];

  return (
    <section className="features-section theme-light" id="features">
      <div className="section-header">
        <h2 className="theme-text-dark">Structured Curriculum Designed for <span className="text-gradient">Real Growth</span></h2>
        <p className="theme-text-muted">Experience the future of incident management with our AI-driven platform designed for sub-second synchronization and deep insights.</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card theme-card-light"
          >
            <div className="icon-box theme-icon-accent">
              {feature.icon}
            </div>
            <h3 className="theme-text-dark">{feature.title}</h3>
            <p className="theme-text-muted">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
