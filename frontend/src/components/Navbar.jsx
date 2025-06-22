import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ScaleIcon } from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo + App Name */}
        <Link to="/" className="flex items-center gap-2">
          <ScaleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            Legal Case Manager
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-[16px] font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            Home
          </Link>

          {!currentUser && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                Register
              </Link>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <Link
                to="/users"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                Users
              </Link>
              <Link
                to="/cases"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                All Cases
              </Link>
              <Link
                to="/cases/new"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                Create Case
              </Link>
            </>
          )}

          {currentUser?.role === 'lawyer' && (
            <>
              <Link
                to="/cases"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                All Cases
              </Link>
              <Link
                to="/my-cases"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                My Cases
              </Link>
            </>
          )}

          {currentUser?.role === 'client' && (
            <Link
              to="/my-cases"
              className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              My Cases
            </Link>
          )}

          {currentUser && (
            <>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                Profile
              </Link>
              <button
                onClick={logout_user}
                className="text-gray-700 hover:text-red-500 dark:text-white dark:hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
