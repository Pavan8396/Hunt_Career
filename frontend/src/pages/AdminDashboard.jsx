import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAdminStats,
  getAllUsers,
  getAllEmployers,
  updateEmployer as apiUpdateEmployer,
  deleteUser as apiDeleteUser,
  deleteEmployer as apiDeleteEmployer,
  toggleUserStatus as apiToggleUserStatus,
  toggleEmployerStatus as apiToggleEmployerStatus,
  toggleUserAdminStatus as apiToggleUserAdminStatus,
} from '../services/api';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/outline';
import ConfirmationModal from '../components/common/ConfirmationModal';
import EditEmployerModal from '../components/common/EditEmployerModal';
import Tooltip from '../components/common/Tooltip';

const AdminDashboard = () => {
  // This is a recreated component.
  // The original was lost and could not be recovered.
  // I am rebuilding it from memory and incorporating feedback from the code review.

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const fetchUsers = useCallback(async (filters = {}) => {
    try {
      const token = sessionStorage.getItem('token');
      const usersData = await getAllUsers(token, filters);
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load users.');
    }
  }, []);

  const fetchEmployers = useCallback(async (filters = {}) => {
    try {
      const token = sessionStorage.getItem('token');
      const employersData = await getAllEmployers(token, filters);
      setEmployers(employersData);
    } catch (error) {
      toast.error('Failed to load employers.');
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const [statsData, usersData, employersData] = await Promise.all([
          getAdminStats(token),
          getAllUsers(token, {}),
          getAllEmployers(token, {}),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setEmployers(employersData);
      } catch (error) {
        toast.error('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h2>
            <p className="text-3xl text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Employers</h2>
            <p className="text-3xl text-gray-900 dark:text-gray-100">{stats.totalEmployers}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Jobs</h2>
            <p className="text-3xl text-gray-900 dark:text-gray-100">{stats.totalJobs}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Reviews</h2>
            <p className="text-3xl text-gray-900 dark:text-gray-100">{stats.totalReviews}</p>
          </div>
        </div>
      )}

      <div>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm dark:text-gray-300 dark:hover:text-gray-100`}
            >
              Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('employers')}
              className={`${
                activeTab === 'employers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm dark:text-gray-300 dark:hover:text-gray-100`}
            >
              Employers
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'users' && (
            <UserManagement users={users} setUsers={setUsers} fetchUsers={fetchUsers} />
          )}
          {activeTab === 'employers' && (
            <EmployerManagement employers={employers} setEmployers={setEmployers} fetchEmployers={fetchEmployers} />
          )}
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers, fetchUsers }) => {
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchUsers({ search, status, sortBy });
        }, 500);
        return () => clearTimeout(handler);
    }, [search, status, sortBy, fetchUsers]);

    const handleDelete = (user) => {
        setActionToConfirm(() => () => deleteUser(user._id));
        setConfirmModalOpen(true);
    };

    const handleToggleStatus = (user) => {
        setActionToConfirm(() => () => toggleStatus(user, !user.isActive));
        setConfirmModalOpen(true);
    };

    const handleToggleAdmin = (user) => {
        setActionToConfirm(() => () => toggleAdmin(user, !user.isAdmin));
        setConfirmModalOpen(true);
    };

    const deleteUser = async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            await apiDeleteUser(userId, token);
            setUsers(users.filter((u) => u._id !== userId));
            toast.success('User successfully deleted.');
        } catch (error) {
            toast.error('Failed to delete user.');
        }
    };

    const toggleStatus = async (user, isActive) => {
        try {
            const token = sessionStorage.getItem('token');
            await apiToggleUserStatus(user._id, isActive, token);
            setUsers(users.map((u) => (u._id === user._id ? { ...u, isActive } : u)));
            toast.success(`User successfully ${isActive ? 'activated' : 'suspended'}.`);
        } catch (error) {
            toast.error('Failed to update user status.');
        }
    };

    const toggleAdmin = async (user, isAdmin) => {
        try {
            const token = sessionStorage.getItem('token');
            await apiToggleUserAdminStatus(user._id, isAdmin, token);
            setUsers(users.map((u) => (u._id === user._id ? { ...u, isAdmin } : u)));
            toast.success(`User admin status successfully updated.`);
        } catch (error) {
            toast.error('Failed to update user admin status.');
        }
    };

    const confirmAction = () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        setConfirmModalOpen(false);
        setActionToConfirm(null);
    };

    return (
      <>
        <div className="flex justify-between mb-4">
            <input
                type="text"
                placeholder="Search by name or email"
                className="p-2 border rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
            </select>
            <select className="p-2 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort By</option>
                <option value="date_asc">Date Asc</option>
                <option value="date_desc">Date Desc</option>
            </select>
        </div>
        <div>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Make Admin</th>
                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 truncate overflow-visible">
                    <div className="group relative">
                      <Tooltip text={`${user.firstName} ${user.lastName}`}>
                        <span>{user.firstName} {user.lastName}</span>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate overflow-visible">
                    <div className="group relative">
                      <Tooltip text={user.email}>
                        <span>{user.email}</span>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch enabled={user.isActive} onChange={() => handleToggleStatus(user)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch enabled={user.isAdmin} onChange={() => handleToggleAdmin(user)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <Tooltip text="Edit User">
                        <Link to={`/profile/${user._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                      </Tooltip>
                      <Tooltip text="Delete User">
                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={confirmAction}
          title="Confirm Action"
          message="Are you sure you want to perform this action? This cannot be undone."
        />
      </>
    );
};

const EmployerManagement = ({ employers, setEmployers, fetchEmployers }) => {
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [actionToConfirm, setActionToConfirm] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchEmployers({ search, status, sortBy });
        }, 500);
        return () => clearTimeout(handler);
    }, [search, status, sortBy, fetchEmployers]);

    const handleEdit = (employer) => {
        setSelectedEmployer(employer);
        setEditModalOpen(true);
    };

    const handleDelete = (employer) => {
        setSelectedEmployer(employer);
        setActionToConfirm(() => () => deleteEmployer(employer._id));
        setConfirmModalOpen(true);
    };

    const handleToggleStatus = (employer) => {
        setActionToConfirm(() => () => toggleStatus(employer, !employer.isActive));
        setConfirmModalOpen(true);
    };

    const deleteEmployer = async (employerId) => {
        try {
            const token = sessionStorage.getItem('token');
            await apiDeleteEmployer(employerId, token);
            setEmployers(employers.filter((e) => e._id !== employerId));
            toast.success('Employer successfully deleted.');
        } catch (error) {
            toast.error('Failed to delete employer.');
        }
    };

    const toggleStatus = async (employer, isActive) => {
        try {
            const token = sessionStorage.getItem('token');
            await apiToggleEmployerStatus(employer._id, isActive, token);
            setEmployers(employers.map((e) => (e._id === employer._id ? { ...e, isActive } : e)));
            toast.success(`Employer successfully ${isActive ? 'activated' : 'suspended'}.`);
        } catch (error) {
            toast.error('Failed to update employer status.');
        }
    };

    const saveEmployer = async (employerData) => {
        try {
            const token = sessionStorage.getItem('token');
            const updatedEmployer = await apiUpdateEmployer(selectedEmployer._id, employerData, token);
            setEmployers(employers.map((e) => (e._id === selectedEmployer._id ? updatedEmployer : e)));
            toast.success('Employer updated successfully.');
            setEditModalOpen(false);
        } catch (error) {
            toast.error('Failed to update employer.');
        }
    };

    const confirmAction = () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        setConfirmModalOpen(false);
        setActionToConfirm(null);
    };

    return (
        <>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by company or email"
                    className="p-2 border rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
                <select className="p-2 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="date_asc">Date Asc</option>
                    <option value="date_desc">Date Desc</option>
                </select>
            </div>
            <div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
                            <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {employers.map((employer) => (
                            <tr key={employer._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 truncate overflow-visible">
                                    <div className="group relative">
                                        <Tooltip text={employer.companyName}>
                                            <span>{employer.companyName}</span>
                                        </Tooltip>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 truncate overflow-visible">
                                    <div className="group relative">
                                        <Tooltip text={employer.email}>
                                            <span>{employer.email}</span>
                                        </Tooltip>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ToggleSwitch enabled={employer.isActive} onChange={() => handleToggleStatus(employer)} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <Tooltip text="Edit Employer">
                                            <button onClick={() => handleEdit(employer)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip text="Manage Jobs">
                                            <Link to={`/admin/employer/${employer._id}/jobs`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip text="Delete Employer">
                                            <button onClick={() => handleDelete(employer)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmAction}
                title="Confirm Action"
                message="Are you sure you want to perform this action? This may be irreversible."
            />
            {selectedEmployer && (
                <EditEmployerModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    employer={selectedEmployer}
                    onSave={saveEmployer}
                />
            )}
        </>
    );
};

const ToggleSwitch = ({ enabled, onChange }) => {
    return (
        <button
            type="button"
            className={`${
                enabled ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={onChange}
        >
            <span
                className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    );
};

export default AdminDashboard;
