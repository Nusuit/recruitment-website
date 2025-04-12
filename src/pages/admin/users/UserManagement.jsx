import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/common/Modal';
import { recruiterAPI } from '../../../api/recruiter';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await recruiterAPI.getUsers();
      setUsers(response.users);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      await recruiterAPI.updateUserStatus(selectedUser.id, newStatus);
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: newStatus }
          : user
      ));
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await recruiterAPI.updateUserRole(selectedUser.id, newRole);
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      ));
      setShowRoleModal(false);
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return <div className="loading-container">Loading users...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>User Management</h1>
        <Link to="/admin/users/new" className="create-user-btn">
          Create User
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <div className="role-filter">
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
              <option value="applicant">Applicant</option>
            </select>
          </div>

          <div className="status-filter">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="col-user">User</div>
          <div className="col-email">Email</div>
          <div className="col-role">Role</div>
          <div className="col-status">Status</div>
          <div className="col-joined">Joined Date</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="col-user">
                <div className="user-info">
                  <img 
                    src={user.avatar || '/assets/images/default-avatar.png'} 
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-id">ID: {user.id}</div>
                  </div>
                </div>
              </div>

              <div className="col-email">{user.email}</div>
              
              <div className="col-role">
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </div>

              <div className="col-status">
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>

              <div className="col-joined">
                {new Date(user.joinedDate).toLocaleDateString()}
              </div>

              <div className="col-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => {/* Navigate to user detail */}}
                >
                  View
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => {/* Navigate to edit user */}}
                >
                  Edit
                </button>
                <button
                  className="action-btn role-btn"
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(user.role);
                    setShowRoleModal(true);
                  }}
                >
                  Change Role
                </button>
                <button
                  className="action-btn status-btn"
                  onClick={() => {
                    setSelectedUser(user);
                    setNewStatus(user.status);
                    setShowStatusModal(true);
                  }}
                >
                  Change Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedUser && (
        <Modal
          title="Update User Status"
          onClose={() => setShowStatusModal(false)}
        >
          <div className="update-status-form">
            <p>Update status for user: <strong>{selectedUser.name}</strong></p>
            
            <div className="form-group">
              <label>New Status:</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button 
                className="update-btn"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Role Update Modal */}
      {showRoleModal && selectedUser && (
        <Modal
          title="Update User Role"
          onClose={() => setShowRoleModal(false)}
        >
          <div className="update-role-form">
            <p>Update role for user: <strong>{selectedUser.name}</strong></p>
            
            <div className="form-group">
              <label>New Role:</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="applicant">Applicant</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="update-btn"
                onClick={handleUpdateRole}
              >
                Update Role
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;