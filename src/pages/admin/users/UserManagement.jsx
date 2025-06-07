// src/pages/admin/users/UserManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Modal from "../../../components/common/Modal"; // Assuming Modal is updated
import { recruiterAPI } from "../../../api/recruiter"; // Assuming this API exists
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../../utils/formatters";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, ADMIN, RECRUITER, CANDIDATE
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE, BLOCKED

  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const availableRoles = ["ADMIN", "RECRUITER", "CANDIDATE"]; // Or fetch from API
  const availableStatuses = ["ACTIVE", "INACTIVE", "BLOCKED"]; // Or fetch

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await recruiterAPI.getUsersList(); // Replace with actual API call
        setUsers(response.payload.content || []); // Assuming users are in payload.content

        // Mock data for now
        // await new Promise((resolve) => setTimeout(resolve, 700));
        // setUsers([
        //   {
        //     id: "user1",
        //     firstName: "Admin",
        //     lastName: "User",
        //     email: "admin@example.com",
        //     role: "ADMIN",
        //     status: "ACTIVE",
        //     joinedDate: new Date(
        //       Date.now() - 30 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     avatarUrl: "/assets/images/admin-avatar.png",
        //   },
        //   {
        //     id: "user2",
        //     firstName: "Recruiter",
        //     lastName: "One",
        //     email: "recruiter1@example.com",
        //     role: "RECRUITER",
        //     status: "ACTIVE",
        //     joinedDate: new Date(
        //       Date.now() - 60 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     avatarUrl: "/assets/images/default-avatar.png",
        //   },
        //   {
        //     id: "user3",
        //     firstName: "Candidate",
        //     lastName: "Alpha",
        //     email: "candidate.alpha@example.com",
        //     role: "CANDIDATE",
        //     status: "INACTIVE",
        //     joinedDate: new Date(
        //       Date.now() - 5 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     avatarUrl: null,
        //   },
        //   {
        //     id: "user4",
        //     firstName: "Candidate",
        //     lastName: "Beta",
        //     email: "candidate.beta@example.com",
        //     role: "CANDIDATE",
        //     status: "BLOCKED",
        //     joinedDate: new Date(
        //       Date.now() - 10 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     avatarUrl: "/assets/images/default-avatar.png",
        //   },
        // ]);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedUser || !newStatus) return;
    try {
      await recruiterAPI.updateUserStatus(selectedUser.id, { status: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again.");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await recruiterAPI.updateUserRole(selectedUser.id, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = `${user.firstName} ${user.lastName}`;
      const matchesSearch =
        searchTerm === "" ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "RECRUITER":
        return "bg-purple-100 text-purple-700";
      case "CANDIDATE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-700";
      case "BLOCKED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading users..." />;
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="user-management-page p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Link
          to="/admin/users/create" // Assuming a route for creating users
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <FontAwesomeIcon icon="user-plus" /> Create User
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
        <div className="relative flex-grow md:max-w-sm">
          <FontAwesomeIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="ALL">All Roles</option>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon="users-slash"
          title="No Users Found"
          description={
            searchTerm || roleFilter !== "ALL" || statusFilter !== "ALL"
              ? "No users match your current filters."
              : "There are no users in the system yet."
          }
        />
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            user.avatarUrl ||
                            "/assets/images/default-avatar.png"
                          }
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(user.joinedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                        setShowRoleModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Change Role"
                    >
                      <FontAwesomeIcon icon="user-shield" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setNewStatus(user.status);
                        setShowStatusModal(true);
                      }}
                      className="text-orange-600 hover:text-orange-900"
                      title="Change Status"
                    >
                      <FontAwesomeIcon icon="toggle-on" />{" "}
                      {/* or fa-toggle-off */}
                    </button>
                    {/* Add View/Edit Profile Link if applicable */}
                    {/* <Link to={`/admin/users/${user.id}/edit`} className="text-yellow-600 hover:text-yellow-900" title="Edit User"><FontAwesomeIcon icon="pen" /></Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals for updating status and role */}
      {showStatusModal && selectedUser && (
        <Modal
          title={`Update Status for ${selectedUser.firstName} ${selectedUser.lastName}`}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          size="md"
        >
          <div className="p-2 space-y-4">
            <p className="text-sm text-gray-600">
              Current Status:{" "}
              <span
                className={`font-semibold ${getStatusClass(
                  selectedUser.status
                )} px-2 py-0.5 rounded-full text-xs`}
              >
                {selectedUser.status}
              </span>
            </p>
            <div>
              <label
                htmlFor="newStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Status:
              </label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showRoleModal && selectedUser && (
        <Modal
          title={`Update Role for ${selectedUser.firstName} ${selectedUser.lastName}`}
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          size="md"
        >
          <div className="p-2 space-y-4">
            <p className="text-sm text-gray-600">
              Current Role:{" "}
              <span
                className={`font-semibold ${getRoleClass(
                  selectedUser.role
                )} px-2 py-0.5 rounded-full text-xs`}
              >
                {selectedUser.role}
              </span>
            </p>
            <div>
              <label
                htmlFor="newRole"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Role:
              </label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
