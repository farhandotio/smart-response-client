import React from 'react';
import { Shield, Cloud, Cpu, Zap, Activity } from 'lucide-react';

const TrustedBy = () => {
  const logos = [
    { name: 'CYBERSEC', icon: <Shield size={18} /> },
    { name: 'CLOUDOPS', icon: <Cloud size={18} /> },
    { name: 'NEXUS', icon: <Cpu size={18} /> },
    { name: 'VOLT', icon: <Zap size={18} /> },
    { name: 'DATAFLOW', icon: <Activity size={18} /> },
  ];

  return (
    <section className="trusted-by">
      <div className="trusted-container">
        <p className="trusted-label">Trusted by industry leaders in security & infrastructure</p>
        <div className="logos-grid">
          {logos.map((logo, index) => (
            <div key={index} className="logo-item">
              {logo.icon}
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
