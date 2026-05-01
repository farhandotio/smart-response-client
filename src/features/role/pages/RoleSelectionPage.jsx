import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import RoleCard from '../components/RoleCard.jsx';

const roles = [
  {
    key: 'developer',
    label: 'Developer',
    description: 'Build software, accept client projects, and scale your tech profile.',
  },
  {
    key: 'client',
    label: 'Client',
    description: 'Post work requests, review proposals, and manage hiring.',
  },
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
              onClick={() => navigate(`/role/create/${role.key}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
