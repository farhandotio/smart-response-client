const RoleCard = ({ title, description, onClick }) => (
  <button type="button" className="role-card" onClick={onClick}>
    <div>
      <p className="role-card-title">{title}</p>
      <p className="role-card-text">{description}</p>
    </div>
    <span className="role-chip">Select {title}</span>
  </button>
);

export default RoleCard;
