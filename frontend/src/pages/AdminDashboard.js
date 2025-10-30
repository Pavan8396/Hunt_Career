import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAdminStats,
  getAllUsers,
  getAllEmployers,
  updateUser as apiUpdateUser,
  updateEmployer as apiUpdateEmployer,
  deleteUser as apiDeleteUser,
  deleteEmployer as apiDeleteEmployer,
  toggleUserStatus as apiToggleUserStatus,
  toggleEmployerStatus as apiToggleEmployerStatus,
  toggleUserAdminStatus as apiToggleUserAdminStatus,
} from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import ConfirmationModal from '../components/common/ConfirmationModal';
import EditUserModal from '../components/common/EditUserModal';
import EditEmployerModal from '../components/common/EditEmployerModal';


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const [statsData, usersData, employersData] = await Promise.all([
          getAdminStats(token),
          getAllUsers(token),
          getAllEmployers(token),
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
    fetchData();
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
            <UserManagement users={users} setUsers={setUsers} />
          )}
          {activeTab === 'employers' && (
            <EmployerManagement employers={employers} setEmployers={setEmployers} />
          )}
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    const handleEdit = (user) => {
      setSelectedUser(user);
      setEditModalOpen(true);
    };

    const handleDelete = (user) => {
      setSelectedUser(user);
      setActionToConfirm(() => () => deleteUser(user._id));
      setConfirmModalOpen(true);
    };

    const handleToggleStatus = (user) => {
      setSelectedUser(user);
      setActionToConfirm(() => () => toggleStatus(user, !user.isActive));
      setConfirmModalOpen(true);
    };

    const handleToggleAdmin = (user) => {
      setSelectedUser(user);
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

    const saveUser = async (userData) => {
      try {
        const token = sessionStorage.getItem('token');
        const updatedUser = await apiUpdateUser(selectedUser._id, userData, token);
        setUsers(users.map((u) => (u._id === selectedUser._id ? updatedUser : u)));
        toast.success('User updated successfully.');
        setEditModalOpen(false);
      } catch (error) {
        toast.error('Failed to update user.');
      }
    };

    const confirmAction = () => {
        if(actionToConfirm) {
            actionToConfirm();
        }
        setConfirmModalOpen(false);
        setSelectedUser(null);
        setActionToConfirm(null);
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Make Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch enabled={user.isActive} onChange={() => handleToggleStatus(user)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch enabled={user.isAdmin} onChange={() => handleToggleAdmin(user)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditUserModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={saveUser} user={selectedUser} />
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

  const EmployerManagement = ({ employers, setEmployers }) => {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [actionToConfirm, setActionToConfirm] = useState(null);

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
      setSelectedEmployer(employer);
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
        if(actionToConfirm) {
            actionToConfirm();
        }
        setConfirmModalOpen(false);
        setSelectedEmployer(null);
        setActionToConfirm(null);
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {employers.map((employer) => (
                <tr key={employer._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{employer.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{employer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch enabled={employer.isActive} onChange={() => handleToggleStatus(employer)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(employer)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => handleDelete(employer)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"><TrashIcon className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditEmployerModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={saveEmployer} employer={selectedEmployer} />
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={confirmAction}
          title="Confirm Action"
          message="Are you sure you want to perform this action? This may be irreversible."
        />
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
