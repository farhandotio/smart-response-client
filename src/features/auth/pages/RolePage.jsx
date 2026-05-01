import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context.jsx';

const roleContent = {
  student: {
    title: 'Student Dashboard',
    subtitle: 'Welcome to your learning space.',
    points: ['View assignments', 'Track progress', 'Access course materials'],
  },
  teacher: {
    title: 'Teacher Dashboard',
    subtitle: 'Manage your classes and students.',
    points: ['Create lessons', 'Review student work', 'Share classroom updates'],
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Control the platform settings and analytics.',
    points: ['Manage users', 'Review reports', 'Configure access levels'],
  },
};

const RolePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || 'student';
  const content = roleContent[role] || roleContent.student;

  return (
    <div className="role-shell">
      <div className="role-panel">
        <div className="role-header">
          <div>
            <p className="role-meta">{role} access</p>
            <h1 className="role-title">{content.title}</h1>
            <p className="role-subtitle">{content.subtitle}</p>
          </div>
          <div className="role-actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/select-role')}>
              Change Role
            </button>
            <button type="button" className="outline-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="role-grid">
          {content.points.map((item) => (
            <div key={item} className="info-card">
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="status-card">
          <p className="status-label">Logged in as</p>
          <p className="status-value">{user?.username} · {user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default RolePage;
