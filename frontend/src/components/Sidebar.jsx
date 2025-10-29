import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  HomeIcon,
  BookmarkIcon,
  ClipboardListIcon,
  PlusCircleIcon,
  CollectionIcon
} from '@heroicons/react/outline';

const Sidebar = () => {
  const { userType } = useContext(AuthContext);

  const jobSeekerLinks = [
    { to: '/home', icon: <HomeIcon className="h-5 w-5 mr-3" />, text: 'Home' },
    { to: '/saved', icon: <BookmarkIcon className="h-5 w-5 mr-3" />, text: 'Saved Jobs' },
    { to: '/applied', icon: <ClipboardListIcon className="h-5 w-5 mr-3" />, text: 'Applied Jobs' },
  ];

  const employerLinks = [
    { to: '/employer/dashboard', icon: <HomeIcon className="h-5 w-5 mr-3" />, text: 'Dashboard' },
    { to: '/employer/post-job', icon: <PlusCircleIcon className="h-5 w-5 mr-3" />, text: 'Post a Job' },
    { to: '/employer/posted-jobs', icon: <CollectionIcon className="h-5 w-5 mr-3" />, text: 'Posted Jobs' },
  ];

  const links = userType === 'employer' ? employerLinks : jobSeekerLinks;

  return (
    <aside className="w-56 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul>
          {links.map((link, index) => (
            <li key={index} className="mb-4">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
                  }`
                }
              >
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;