import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/auth.context.jsx';
import { useRoleActions } from '../hooks/useRoleActions.jsx';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfileOverviewPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { loadMe, updateProfile, loading } = useRoleActions();
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit state for engineers
  const [editBio, setEditBio] = useState('');
  const [editSeniority, setEditSeniority] = useState('mid');
  const [editExpertise, setEditExpertise] = useState('');
  const [editExpertiseTags, setEditExpertiseTags] = useState([]);
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setPageLoading(true);
      const data = await loadMe();
      if (data?.profile) {
        setProfile(data.profile);
        if (user?.role === 'engineer') {
          setEditBio(data.profile?.bio || '');
          setEditSeniority(data.profile?.seniority || 'mid');
          setEditExpertiseTags(data.profile?.expertise || []);
          setPreviewImage(data.profile?.picture || '');
        }
      }
      setPageLoading(false);
    };

    if (user?.isAuthenticated) {
      fetchProfile();
    }
  }, [loadMe, user?.isAuthenticated]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addExpertiseTag = () => {
    if (editExpertise.trim()) {
      if (!editExpertiseTags.includes(editExpertise.trim())) {
        setEditExpertiseTags([...editExpertiseTags, editExpertise.trim()]);
      }
      setEditExpertise('');
    }
  };

  const removeExpertiseTag = (tag) => {
    setEditExpertiseTags(editExpertiseTags.filter((t) => t !== tag));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (editExpertiseTags.length === 0) {
      toast.error('Please add at least one expertise');
      return;
    }

    if (editBio && editBio.length < 10) {
      toast.error('Bio must be at least 10 characters long');
      return;
    }

    const success = await updateProfile({
      bio: editBio,
      seniority: editSeniority,
      expertise: editExpertiseTags,
      image: editImage,
    });

    if (success) {
      setIsEditing(false);
      const data = await loadMe();
      if (data?.profile) setProfile(data.profile);
    }
  };

  const sections = useMemo(() => {
    if (user?.role === 'engineer') {
      return [
        { label: 'Seniority', value: profile?.seniority || 'N/A' },
        { label: 'Expertise', value: profile?.expertise?.join(', ') || 'N/A' },
        { label: 'Availability', value: profile?.availabilityStatus || 'Offline' },
      ];
    }

    return [
      { label: 'Organization', value: profile?.name || profile?.companyName || 'N/A' },
      { label: 'Subscription', value: profile?.subscriptionPlan || 'Free' },
    ];
  }, [profile, user?.role]);

  const isEngineer = user?.role === 'engineer';

  return (
    <div className="dashboard-layout">
      <Sidebar
        role={user?.role}
        activeTab="profile"
        setActiveTab={(tab) => {
          if (tab !== 'profile') navigate('/dashboard');
        }}
      />

      <main className="dashboard-main">
        <TopNav user={user} logout={logout} />

        <div className="dashboard-content">
          <header style={{ marginBottom: '2.5rem' }}>
            <p className="dashboard-label">User Profile</p>
            <h1 className="dashboard-title">{user?.username}</h1>
            <p
              className="dashboard-subtitle"
              style={{ color: 'var(--text-3)', marginTop: '0.5rem' }}
            >
              Manage your role:{' '}
              {user?.role === 'company_admin' ? 'Company Admin' : 'Field Engineer'}
            </p>
          </header>

          {pageLoading ? (
            <div className="dashboard-empty">Loading profile...</div>
          ) : (
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
              {isEngineer && !isEditing && (
                <section className="dashboard-card" style={{ marginBottom: '2rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div className="dashboard-section-header">
                      <h2 className="dashboard-section-title">Professional Profile</h2>
                      <p className="dashboard-section-text">
                        Update your engineer profile information.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="auth-button auth-button--primary"
                      style={{ width: 'auto', padding: '0.6rem 1.5rem', marginTop: 0 }}
                    >
                      Edit Profile
                    </button>
                  </div>
                </section>
              )}

              {isEngineer && isEditing && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="dashboard-card"
                  style={{
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--line-hi)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2rem',
                    }}
                  >
                    <h2 className="dashboard-section-title">Edit Engineer Profile</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="auth-button auth-button--secondary"
                      style={{ width: 'auto', padding: '0.6rem 1rem' }}
                    >
                      Cancel
                    </button>
                  </div>

                  <form
                    onSubmit={handleSaveProfile}
                    className="auth-form"
                    style={{ maxWidth: 'none' }}
                  >
                    <div
                      className="dashboard-grid"
                      style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem',
                      }}
                    >
                      {/* Profile Picture */}
                      <div className="auth-field">
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            color: 'var(--text-2)',
                            marginBottom: '1rem',
                            fontWeight: '600',
                          }}
                        >
                          Profile Picture
                        </label>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '12px',
                                background: previewImage ? `url(${previewImage})` : 'var(--bg-1)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '2px solid var(--line-hi)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-3)',
                                fontSize: '3rem',
                              }}
                            >
                              {!previewImage && '📷'}
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                              />
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.75rem 1.5rem',
                                  background: 'var(--accent)',
                                  color: '#000',
                                  borderRadius: 'var(--r)',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  width: 'fit-content',
                                }}
                              >
                                <Upload size={18} />
                                Choose Image
                              </div>
                            </label>
                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-3)',
                                marginTop: '0.5rem',
                              }}
                            >
                              JPG, PNG or GIF (max 5MB)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Seniority */}
                      <div className="auth-field">
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            color: 'var(--text-2)',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                          }}
                        >
                          Seniority Level
                        </label>
                        <select
                          className="auth-input"
                          value={editSeniority}
                          onChange={(e) => setEditSeniority(e.target.value)}
                          style={{ padding: '0.75rem' }}
                        >
                          <option value="junior">Junior</option>
                          <option value="mid">Mid-Level</option>
                          <option value="senior">Senior</option>
                          <option value="lead">Lead</option>
                        </select>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="auth-field" style={{ marginBottom: '2rem' }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.85rem',
                          color: 'var(--text-2)',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                        }}
                      >
                        Expertise Skills
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                          type="text"
                          className="auth-input"
                          value={editExpertise}
                          onChange={(e) => setEditExpertise(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addExpertiseTag();
                            }
                          }}
                          placeholder="e.g. Node.js, React, DevOps..."
                          style={{ flex: 1, padding: '0.75rem' }}
                        />
                        <button
                          type="button"
                          onClick={addExpertiseTag}
                          className="auth-button auth-button--secondary"
                          style={{ width: 'auto', padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
                        >
                          Add Skill
                        </button>
                      </div>

                      {editExpertiseTags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {editExpertiseTags.map((tag) => (
                            <div
                              key={tag}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 102, 51, 0.1)',
                                border: '1px solid var(--accent)',
                                borderRadius: 'var(--r)',
                                color: 'var(--accent)',
                                fontSize: '0.9rem',
                              }}
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeExpertiseTag(tag)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'inherit',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <div className="auth-field" style={{ marginBottom: '2rem' }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.85rem',
                          color: 'var(--text-2)',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                        }}
                      >
                        Professional Bio
                      </label>
                      <textarea
                        className="auth-input"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Tell us about your professional background and interests..."
                        style={{ minHeight: '140px', padding: '0.75rem', resize: 'vertical' }}
                      />
                      <p
                        style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.5rem' }}
                      >
                        {editBio.length} / 500 characters
                      </p>
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="auth-button auth-button--secondary"
                        style={{ width: 'auto', padding: '0.75rem 2rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="auth-button auth-button--primary"
                        disabled={loading}
                        style={{ width: 'auto', padding: '0.75rem 2rem' }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}

              {!isEditing && (
                <section className="dashboard-card">
                  <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Personal Details</h2>
                    <p className="dashboard-section-text">Your account overview and settings.</p>
                  </div>

                  <div
                    className="dashboard-grid"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      marginTop: '1.5rem',
                    }}
                  >
                    {sections.map((item) => (
                      <div
                        key={item.label}
                        className="dashboard-card"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            color: 'var(--accent-soft)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            margin: '0.5rem 0 0',
                            fontSize: '1.25rem',
                            color: '#fff',
                            fontWeight: '800',
                          }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isEngineer && (
                    <div
                      className="dashboard-card"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        marginTop: '1.5rem',
                        display: 'flex',
                        gap: '1.5rem',
                      }}
                    >
                      {profile?.picture && (
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            background: `url(${profile.picture})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '2px solid var(--line-hi)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            color: 'var(--accent-soft)',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                          }}
                        >
                          Bio
                        </p>
                        <p
                          style={{
                            margin: '0.5rem 0 0',
                            color: 'var(--text-2)',
                            lineHeight: '1.6',
                          }}
                        >
                          {profile?.bio || 'No bio added yet.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!isEngineer && (
                    <div
                      className="dashboard-card"
                      style={{ background: 'rgba(255, 255, 255, 0.03)', marginTop: '1.5rem' }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: 'var(--accent-soft)',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}
                      >
                        Description
                      </p>
                      <p
                        style={{ margin: '0.5rem 0 0', color: 'var(--text-2)', lineHeight: '1.6' }}
                      >
                        {profile?.description || profile?.companyDesc || 'No description provided.'}
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileOverviewPage;
