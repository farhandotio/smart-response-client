import { useCallback, useState } from 'react';
import { useAuth } from '../../auth/auth.context.jsx';
import * as roleService from '../services/role.service.jsx';
import { toast } from 'react-toastify';

export const useRoleActions = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadMe = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getMe();
      if (data?.user) {
        setUser({ ...data.user, isAuthenticated: true });
      }
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const createCompany = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('description', payload.description);
        formData.append('logSources', JSON.stringify(payload.logSources));
        if (payload.image) {
          formData.append('image', payload.image);
        }

        const data = await roleService.createCompany(formData);
        // Refresh user data after company creation
        await loadMe();
        toast.success('Company workspace created successfully!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadMe]
  );

  const createEngineerProfile = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('seniority', payload.seniority);
        formData.append('bio', payload.bio);
        formData.append('expertise', JSON.stringify(payload.expertise));
        if (payload.image) {
          formData.append('image', payload.image);
        }
        if (payload.inviteToken) {
          formData.append('inviteToken', payload.inviteToken);
        }

        const data = await roleService.setupEngineerProfile(formData);
        await loadMe();
        toast.success('Engineer profile set up successfully!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadMe]
  );

  const inviteMember = useCallback(
    async (email) => {
      setLoading(true);
      try {
        const data = await roleService.inviteEngineer(email);
        toast.success(data.message || 'Invitation sent successfully!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getWorkspaceData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getWorkspaceData();
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getInvitations();
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptInvitation = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const data = await roleService.acceptInvitation(inviteId);
      toast.success(data.message || 'Invitation accepted!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const getAllCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getAllCompanies();
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await roleService.updateCompany(payload);
      toast.success('Workspace updated successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const kickMember = useCallback(async (engineerId) => {
    setLoading(true);
    try {
      const data = await roleService.kickMember(engineerId);
      toast.success(data.message || 'Member removed successfully!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIncidentStatus = useCallback(async (id, status, resolutionSummary) => {
    setLoading(true);
    try {
      const data = await roleService.updateIncidentStatus(id, status, resolutionSummary);
      toast.success('Incident status updated!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIncidents = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await roleService.getIncidents(params);
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loadMe,
    createCompany,
    createEngineerProfile,
    inviteMember,
    getWorkspaceData,
    getInvitations,
    acceptInvitation,
    getAllCompanies,
    updateCompany,
    kickMember,
    getIncidents,
    updateIncidentStatus,
    triggerManualScan: useCallback(async () => {
      setLoading(true);
      try {
        await roleService.triggerManualScan();
        toast.success('Manual log scan completed!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    }, []),
    assignEngineer: useCallback(async (id, engineerId) => {
      setLoading(true);
      try {
        await roleService.assignEngineer(id, engineerId);
        toast.success('Incident assigned successfully!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    }, []),
    unassignEngineer: useCallback(async (id, engineerId) => {
      setLoading(true);
      try {
        await roleService.unassignEngineer(id, engineerId);
        toast.success('Engineer removed from task!');
        return true;
      } catch (error) {
        toast.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    }, []),
    loading,
  };
};
