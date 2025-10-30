import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getAdminStats, getAllUsers, deleteUser } from '../services/api'; // These will be created
import { FaUsers, FaBriefcase, FaStar, FaUserTimes } from 'react-icons/fa';

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center`}>
    <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        getAdminStats(token),
        getAllUsers(token),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId, token);
        toast.success('User deleted successfully.');
        fetchData(); // Refresh data
      } catch (error) {
        toast.error('Failed to delete user.');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaUsers />} title="Total Users" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard icon={<FaBriefcase />} title="Total Employers" value={stats.totalEmployers} color="bg-indigo-500" />
          <StatCard icon={<FaBriefcase />} title="Total Jobs" value={stats.totalJobs} color="bg-pink-500" />
          <StatCard icon={<FaStar />} title="Total Reviews" value={stats.totalReviews} color="bg-green-500" />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 bg-red-600 text-white rounded"
                      title="Delete User"
                    >
                      <FaUserTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
