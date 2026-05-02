import React, { useState } from 'react';
import commandImage from '../../../assets/unified-command.png';

const UnifiedCommand = () => {
  const [activeTab, setActiveTab] = useState('Timeline');

  return (
    <section className="unified-command">
      <div className="section-content">
        <div className="header">
          <span>The Control Center</span>
          <h2>Unified Incident Command</h2>
        </div>

        <div className="tabs">
          {['Timeline View', 'Log Analytics', 'Team Status'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="command-visual">
          <img src={commandImage} alt="Unified Incident Command" />
        </div>
      </div>
    </section>
  );
};

export default UnifiedCommand;
