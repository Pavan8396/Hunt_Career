import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tooltip from './common/Tooltip';
import {
  HomeIcon,
  BookmarkIcon,
  ClipboardListIcon,
  PlusCircleIcon,
  CollectionIcon,
  UserCircleIcon,
  OfficeBuildingIcon,
  ShieldCheckIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const userType = user?.type;

  const jobSeekerLinks = [
    { to: '/home', icon: <HomeIcon className="h-5 w-5" />, text: 'Home' },
    { to: '/saved', icon: <BookmarkIcon className="h-5 w-5" />, text: 'Saved Jobs' },
    { to: '/applied', icon: <ClipboardListIcon className="h-5 w-5" />, text: 'Applied Jobs' },
    { to: '/profile', icon: <UserCircleIcon className="h-5 w-5" />, text: 'Profile' },
  ];

  const employerLinks = [
    { to: '/employer/dashboard', icon: <HomeIcon className="h-5 w-5" />, text: 'Dashboard' },
    { to: '/employer/post-job', icon: <PlusCircleIcon className="h-5 w-5" />, text: 'Post a Job' },
    { to: '/employer/posted-jobs', icon: <CollectionIcon className="h-5 w-5" />, text: 'Posted Jobs' },
    { to: '/employer/profile', icon: <OfficeBuildingIcon className="h-5 w-5" />, text: 'Company Profile' },
  ];

  const links = userType === 'employer' ? employerLinks : jobSeekerLinks;

  return (
    <aside className={`bg-gray-800 text-white min-h-screen p-4 transition-all duration-300 relative flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-56'}`}>
      <nav>
        <ul>
          {links.map((link, index) => (
            <li key={index} className="mb-4">
              <Tooltip text={link.text}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md transition-colors ${
                      isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <div className={`${isCollapsed ? '' : 'mr-3'}`}>{link.icon}</div>
                  {!isCollapsed && <span>{link.text}</span>}
                </NavLink>
              </Tooltip>
            </li>
          ))}
          {user && user.isAdmin && (
            <li className="mb-4">
              <Tooltip text="Admin">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md transition-colors ${
                      isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-700'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <div className={`${isCollapsed ? '' : 'mr-3'}`}><ShieldCheckIcon className="h-5 w-5" /></div>
                  {!isCollapsed && <span>Admin</span>}
                </NavLink>
              </Tooltip>
            </li>
          )}
        </ul>
      </nav>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 transition-colors">
          {isCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
