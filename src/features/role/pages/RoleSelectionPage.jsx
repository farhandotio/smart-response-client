import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import * as authService from '../../auth/services/auth.service.jsx';
import RoleCard from '../components/RoleCard.jsx';
import { toast } from 'react-toastify';

const roles = [
  {
    key: 'company_admin',
    label: 'Company Admin (Leader)',
    description: 'Register your company, manage infrastructure logs, and invite your engineering team.',
  },
  {
    key: 'engineer',
    label: 'Engineer',
    description: 'Monitor incidents, analyze logs, and collaborate on real-time resolution.',
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
    <div className="role-shell">
      <div className="role-panel">
        <div className="role-header">
          <div>
            <h1 className="role-title">Choose your role</h1>
            <p className="role-subtitle">
              Hi {user?.username || 'User'}, select the role you want to continue with.
            </p>
          </div>
        </div>

        <div className="role-grid">
          {roles.map((role) => (
            <RoleCard
              key={role.key}
              title={role.label}
              description={role.description}
              onClick={() => handleRoleSelect(role.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
