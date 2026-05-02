import React from 'react';
import { FiShield, FiCloud, FiCpu, FiZap, FiActivity } from 'react-icons/fi';

const TrustedBy = () => {
  const logos = [
    { name: 'CYBERSEC', icon: <FiShield /> },
    { name: 'CLOUDOPS', icon: <FiCloud /> },
    { name: 'NEXUS', icon: <FiCpu /> },
    { name: 'VOLT', icon: <FiZap /> },
    { name: 'DATAFLOW', icon: <FiActivity /> },
  ];

  return (
    <section className="trusted-by">
      <p>Trusted by industry leaders in security & infrastructure</p>
      <div className="logos">
        {logos.map((logo, index) => (
          <div key={index} className="logo-item">
            {logo.icon}
            <span>{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBy;
