import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../../../api/recruiter';
import Modal from '../../../components/common/Modal';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const defaultPermissions = {
    createJob: false,
    editJob: false,
    deleteJob: false,
    viewApplications: false,
    manageApplications: false,
    viewReports: false,
    manageUsers: false,
    manageRoles: false,
    viewCompanyProfile: false,
    editCompanyProfile: false
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: { ...defaultPermissions }
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getRoles();
      setRoles(response.roles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roles. Please try again.');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      await recruiterAPI.createRole(formData);
      await fetchRoles();
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        permissions: { ...defaultPermissions }
      });
    } catch (err) {
      setError('Failed to create role. Please try again.');
      console.error('Error creating role:', err);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;

    try {
      await recruiterAPI.updateRole(selectedRole.id, formData);
      await fetchRoles();
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update role. Please try again.');
      console.error('Error updating role:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await recruiterAPI.deleteRole(roleId);
      await fetchRoles();
    } catch (err) {
      setError('Failed to delete role. Please try again.');
      console.error('Error deleting role:', err);
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  if (loading) {
    return <div className="loading-indicator">Loading roles...</div>;
  }

  return (
    <div className="role-management-page">
      <div className="page-header">
        <h1>Role Management</h1>
        <button 
          className="create-role-btn"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Role
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="roles-grid">
        {roles.map(role => (
          <div key={role.id} className="role-card">
            <div className="role-header">
              <h3>{role.name}</h3>
              <div className="role-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedRole(role);
                    setFormData({
                      name: role.name,
                      description: role.description,
                      permissions: role.permissions
                    });
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRole(role.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="role-description">{role.description}</p>

            <div className="permissions-list">
              <h4>Permissions</h4>
              {Object.entries(role.permissions).map(([permission, enabled]) => (
                <div key={permission} className="permission-item">
                  <span className={`permission-status ${enabled ? 'enabled' : 'disabled'}`}>
                    {enabled ? '✓' : '×'}
                  </span>
                  <span className="permission-name">
                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <Modal
          title="Create New Role"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="role-form">
            <div className="form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter role name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter role description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-grid">
                {Object.entries(formData.permissions).map(([permission, enabled]) => (
                  <label key={permission} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateRole}
              >
                Create Role
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <Modal
          title={`Edit Role: ${selectedRole.name}`}
          onClose={() => setShowEditModal(false)}
        >
          <div className="role-form">
            <div className="form-group">
              <label>Role Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter role name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter role description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Permissions</label>
              <div className="permissions-grid">
                {Object.entries(formData.permissions).map(([permission, enabled]) => (
                  <label key={permission} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    {permission.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={handleEditRole}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoleManagement;