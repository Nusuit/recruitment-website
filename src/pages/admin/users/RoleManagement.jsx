// src/pages/admin/users/RoleManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import Modal from "../../../components/common/Modal"; // Assuming Modal is updated
import { recruiterAPI } from "../../../api/recruiter"; // Assuming this API exists
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Define default permissions structure - this should ideally come from a config or API
const ALL_PERMISSIONS_LIST = [
  { id: "viewDashboard", label: "View Dashboard" },
  { id: "manageJobs", label: "Manage Jobs (Create, Edit, Delete)" },
  { id: "viewApplicants", label: "View Applicants" },
  { id: "manageApplicants", label: "Manage Applicants (Status, Notes)" },
  { id: "manageUsers", label: "Manage Users" },
  { id: "manageRoles", label: "Manage Roles & Permissions" },
  { id: "viewCompanyProfile", label: "View Company Profile" },
  { id: "editCompanyProfile", label: "Edit Company Profile" },
  { id: "viewAnalytics", label: "View Analytics & Reports" },
  { id: "manageSettings", label: "Manage System Settings" },
];

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // null for create, role object for edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: ALL_PERMISSIONS_LIST.reduce(
      (acc, perm) => ({ ...acc, [perm.id]: false }),
      {}
    ),
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recruiterAPI.getRolesList(); // Replace with actual API call
      setRoles(response.payload.content || []); // Assuming roles are in payload.content
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // setRoles([
      //   {
      //     id: "role1",
      //     name: "Administrator",
      //     description: "Full access to all system features.",
      //     permissions: ALL_PERMISSIONS_LIST.reduce(
      //       (acc, perm) => ({ ...acc, [perm.id]: true }),
      //       {}
      //     ),
      //   },
      //   {
      //     id: "role2",
      //     name: "Recruiter",
      //     description: "Can manage jobs and applicants.",
      //     permissions: {
      //       ...ALL_PERMISSIONS_LIST.reduce(
      //         (acc, perm) => ({ ...acc, [perm.id]: false }),
      //         {}
      //       ),
      //       manageJobs: true,
      //       viewApplicants: true,
      //       manageApplicants: true,
      //     },
      //   },
      //   {
      //     id: "role3",
      //     name: "Hiring Manager",
      //     description: "Can view applicants for their assigned jobs.",
      //     permissions: {
      //       ...ALL_PERMISSIONS_LIST.reduce(
      //         (acc, perm) => ({ ...acc, [perm.id]: false }),
      //         {}
      //       ),
      //       viewApplicants: true,
      //     },
      //   },
      // ]);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: {
          ...ALL_PERMISSIONS_LIST.reduce(
            (acc, perm) => ({ ...acc, [perm.id]: false }),
            {}
          ),
          ...role.permissions,
        },
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: ALL_PERMISSIONS_LIST.reduce(
          (acc, perm) => ({ ...acc, [perm.id]: false }),
          {}
        ),
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePermissionChange = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: !prev.permissions[permissionId],
      },
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Role name is required.";
    if (!formData.description.trim())
      errors.description = "Description is required.";
    // Add more validation if needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Consider a different loading state for form submission
    setError(null);
    try {
      const permissionsArray = ALL_PERMISSIONS_LIST
        .filter(p => formData.permissions[p.id])
        .map(p => ({ permissionId: p.id })); // Assuming backend expects permissionId

      const payload = { ...formData, permissions: permissionsArray };

      if (editingRole) {
        await recruiterAPI.updateRole(editingRole.id, payload);
        // setRoles(
        //   roles.map((r) =>
        //     r.id === editingRole.id ? { ...editingRole, ...formData } : r
        //   )
        // ); // Mock update
      } else {
        await recruiterAPI.createRole(payload);
        // setRoles([...roles, { ...formData, id: `role${Date.now()}` }]); // Mock create
      }
      fetchRoles(); // Re-fetch or update local state
      handleCloseModal();
    } catch (err) {
      console.error("Error saving role:", err);
      setError(err.message || "Failed to save role.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this role? This cannot be undone.`
      )
    )
      return;
    try {
      await recruiterAPI.deleteRole(roleId);
      fetchRoles(); // Re-fetch roles after deletion
    } catch (err) {
      console.error("Error deleting role:", err);
      setError("Failed to delete role. Please try again.");
    }
  };

  if (loading && roles.length === 0)
    return <LoadingSpinner fullPage message="Loading roles..." />;
  if (error && roles.length === 0)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="role-management-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Role & Permission Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <FontAwesomeIcon icon="plus" /> Create New Role
        </button>
      </div>
      {error && (
        <div className="p-4 text-red-600 bg-red-100 rounded-md">{error}</div>
      )}

      {roles.length === 0 && !loading ? (
        <EmptyState
          icon="user-shield"
          title="No Roles Defined"
          description="Create roles to manage user permissions across the platform."
          action={
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Role
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden">
                  {role.description}
                </p>
              </div>
              <div className="mb-4 flex-grow">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Permissions:
                </h4>
                <ul className="space-y-1 text-xs">
                  {ALL_PERMISSIONS_LIST.slice(0, 4).map(
                    (
                      perm // Show a few permissions
                    ) => (
                      <li
                        key={perm.id}
                        className={`flex items-center ${
                          role.permissions[perm.id]
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            role.permissions[perm.id]
                              ? "check-circle"
                              : "times-circle"
                          }
                          className="mr-2"
                        />
                        {perm.label}
                      </li>
                    )
                  )}
                  {Object.keys(role.permissions).filter(
                    (p) => role.permissions[p]
                  ).length > 4 && (
                    <li className="text-gray-400">...and more</li>
                  )}
                </ul>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(role)}
                  className="px-3 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={
            editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"
          }
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          size="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6 p-2">
            <div>
              <label
                htmlFor="roleName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role Name*
              </label>
              <input
                type="text"
                id="roleName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                  formErrors.name
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="roleDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <textarea
                id="roleDescription"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className={`w-full p-2.5 border rounded-md focus:ring-2 ${
                  formErrors.description
                    ? "border-red-500 ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {formErrors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">
                Permissions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 max-h-60 overflow-y-auto p-1">
                {ALL_PERMISSIONS_LIST.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer p-1.5 rounded-md hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name={perm.id}
                      checked={!!formData.permissions[perm.id]}
                      onChange={() => handlePermissionChange(perm.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading
                  ? "Saving..."
                  : editingRole
                  ? "Save Changes"
                  : "Create Role"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RoleManagement;
