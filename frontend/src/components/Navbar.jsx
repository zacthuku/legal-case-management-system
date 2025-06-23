import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScaleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { currentUser, logout_user } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <ScaleIcon className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">
            Legal Case Manager
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-[16px] font-medium">
          <NavLinks currentUser={currentUser} logout_user={logout_user} />
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 text-[16px] font-medium">
          <NavLinks
            currentUser={currentUser}
            logout_user={logout_user}
            closeMenu={closeMenu}
          />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ currentUser, logout_user, closeMenu }) => (
  <>
    <Link
      to="/"
      onClick={closeMenu}
      className="block text-gray-700 hover:text-blue-600"
    >
      Home
    </Link>

    {!currentUser && (
      <>
        <Link
          to="/login"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          Register
        </Link>
      </>
    )}

    {currentUser?.role === 'admin' && (
      <>
        <Link
          to="/users"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          Users
        </Link>
        <Link
          to="/cases"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          All Cases
        </Link>
        <Link
          to="/cases/new"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          Create Case
        </Link>
      </>
    )}

    {(currentUser?.role === 'lawyer' || currentUser?.role === 'client') && (
      <Link
        to="/my-cases"
        onClick={closeMenu}
        className="block text-gray-700 hover:text-blue-600"
      >
        My Cases
      </Link>
    )}

    {currentUser && (
      <>
        <Link
          to="/profile"
          onClick={closeMenu}
          className="block text-gray-700 hover:text-blue-600"
        >
          Profile
        </Link>
        <button
          onClick={() => {
            logout_user();
            closeMenu?.();
          }}
          className="block text-left text-gray-700 hover:text-red-500"
        >
          Logout
        </button>
      </>
    )}
  </>
);

export default Navbar;
