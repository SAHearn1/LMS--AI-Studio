import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  role?: 'teacher' | 'student' | 'parent' | 'admin';
}

const Navigation: React.FC<NavigationProps> = ({ role }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinks = role ? [
    { path: `/dashboard/${role}/courses`, label: role === 'parent' ? 'Overview' : 'Courses', show: true },
    { path: `/dashboard/${role}/profile`, label: 'Profile', show: true },
    { path: '/dashboard/settings', label: 'Settings', show: true },
  ] : [
    { path: '/login', label: 'Login', show: true },
    { path: '/signup', label: 'Sign Up', show: true },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">LMS</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => 
                link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(link.path)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="flex items-center">
            {role && (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => 
            link.show && (
              <Link
                key={link.path}
                to={link.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
