import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const EmployerLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <nav>
          <ul>
            <li className="mb-2">
              <NavLink to="/employer/dashboard" className={({ isActive }) => isActive ? "text-blue-400" : ""}>
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/employer/post-job" className={({ isActive }) => isActive ? "text-blue-400" : ""}>
                Post a Job
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/employer/posted-jobs" className={({ isActive }) => isActive ? "text-blue-400" : ""}>
                Posted Jobs
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/employer/shortlisted-candidates" className={({ isActive }) => isActive ? "text-blue-400" : ""}>
                Shortlisted Candidates
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployerLayout;
