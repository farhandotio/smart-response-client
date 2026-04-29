import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';

const roles = [
  { key: 'student', label: 'Student', description: 'Access study materials and course dashboards.' },
  { key: 'teacher', label: 'Teacher', description: 'Manage classes, assignments, and student progress.' },
  { key: 'admin', label: 'Admin', description: 'Control permissions, view analytics, and manage users.' },
];

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { user, selectRole, logout } = useAuth();

  return (
    <div className="role-shell">
      <div className="role-panel">
        <div className="role-header">
          <div>
            <h1 className="role-title">Choose your role</h1>
            <p className="role-subtitle">Hi {user?.username || 'User'}, pick the role you want to continue with.</p>
          </div>
          <button type="button" className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="role-grid">
          {roles.map((role) => (
            <button
              key={role.key}
              type="button"
              className="role-card"
              onClick={() => {
                selectRole(role.key);
                navigate('/dashboard');
              }}
            >
              <p className="role-card-title">{role.label}</p>
              <p className="role-card-text">{role.description}</p>
              <span className="role-chip">Select {role.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
