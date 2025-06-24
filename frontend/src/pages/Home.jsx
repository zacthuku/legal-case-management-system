import React, { useContext } from "react";
import { ScaleIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom"; // Import Link for routing

function Home() {
  const { currentUser, isFirstTimeUser } = useContext(UserContext);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
      {/* Left section */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        {/* Welcome messages */}
        {currentUser && (
          <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-400">
            {isFirstTimeUser
              ? `Welcome, ${currentUser.username}! Let's get started.`
              : `Welcome back, ${currentUser.username}!`}
          </h2>
        )}

        {/* Tagline */}
        <p className="text-gray-800 dark:text-gray-1000 text-3xl max-w-md mx-auto md:mx-0 leading-relaxed mt-4">
          Streamline legal case tracking, document management, and communication
          between clients, lawyers, and administrators.
        </p>

        {/* Show Sign In/Up if not logged in */}
        {!currentUser && (
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="border border-gray-700 px-6 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Right section: Illustration */}
      <div className="flex-1 text-center hidden lg:flex">
        <div className="m-12 xl:m-16 w-full flex items-center justify-center">
          <img
            src="/Law firm-cuate.svg"
            alt="Legal case illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
