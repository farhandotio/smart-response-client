import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const RoleCard = ({ title, description, icon, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
    whileTap={{ scale: 0.98 }}
    type="button" 
    className="role-card-modern" 
    onClick={onClick}
  >
    <div className="role-card-icon">
      {icon}
    </div>
    <div className="role-card-content">
      <h3 className="role-card-title">{title}</h3>
      <p className="role-card-text">{description}</p>
    </div>
    <div className="role-card-footer">
      <span>Get Started</span>
      <ChevronRight size={16} />
    </div>
  </motion.button>
);

export default RoleCard;
