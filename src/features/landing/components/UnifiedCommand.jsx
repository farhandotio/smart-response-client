import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import commandImage from '../../../assets/unified-command.png';

const UnifiedCommand = () => {
  const [activeTab, setActiveTab] = useState('Timeline View');

  const tabContent = {
    'Timeline View': 'Track every action, decision, and update in a single source of truth.',
    'Log Analytics': 'AI-powered log parsing that highlights critical failures instantly.',
    'Team Status': 'Real-time presence and assignment status of your entire response unit.'
  };

  return (
    <section className="unified-command">
      <div className="section-content">
        <div className="header">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="section-tag"
          >
            The Control Center
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Unified <span className="text-gradient">Incident Command</span>
          </motion.h2>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-active" className="tab-indicator" />
                )}
              </button>
            ))}
          </div>
          <p className="tab-description">{tabContent[activeTab]}</p>
        </div>

        <motion.div 
           key={activeTab}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="command-visual"
        >
          <div className="browser-frame">
             <div className="frame-header">
                <div className="frame-dots">
                   <span></span><span></span><span></span>
                </div>
             </div>
             <img src={commandImage} alt="Unified Incident Command" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UnifiedCommand;
