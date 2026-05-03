import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/auth.context.jsx';
import * as authService from '../../auth/services/auth.service.jsx';
import RoleCard from '../components/RoleCard.jsx';
import { toast } from 'react-toastify';
import { Shield, HardHat, Zap } from 'lucide-react';

const roles = [
  {
    key: 'company_admin',
    label: 'Company Admin',
    description: 'Establish your command center, integrate log sources, and lead your response team.',
    icon: <Shield size={32} />,
  },
  {
    key: 'engineer',
    label: 'Field Engineer',
    description: 'Analyze real-time diagnostic reports, resolve incidents, and secure infrastructure.',
    icon: <HardHat size={32} />,
  },
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleRoleSelect = async (roleKey) => {
    try {
      const data = await authService.updateRole(roleKey);
      if (data?.success) {
        setUser({ ...user, role: roleKey });
        navigate(`/role/create/${roleKey}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-shell">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="role-panel"
      >
        <div className="auth-brand">
           <Zap className="brand-icon" size={32} />
           <span className="brand-text">SIRP AI</span>
        </div>

        <div className="role-header">
            <h1 className="auth-title">Define Your Identity</h1>
            <p className="auth-subtitle">
              Hi <span className="auth-highlight">{user?.username}</span>, how will you contribute to the network today?
            </p>
        </div>

        <div className="role-grid-2">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
                <RoleCard
                  title={role.label}
                  description={role.description}
                  icon={role.icon}
                  onClick={() => handleRoleSelect(role.key)}
                />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;
