import Link from "next/link";
import React from "react";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1F1F1F] to-[#1F2527] text-white p-4">
      {/* Main Content Container */}
      <div className="max-w-md w-full text-center space-y-6">
        {/* Warning Icon */}
        <svg
          className="w-16 h-16 mx-auto text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-red-500">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl text-gray-300">
          You don’t have permission to view this page. Please log in with the
          correct credentials or return to the homepage.
        </p>

        {/* Static Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
          {/* <a
            href="/user/auth"
            className="inline-block px-4 py-2 border border-gray-500 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Log In
          </a> */}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Tripin. All rights reserved.
      </footer>
    </div>
  );
};

export default UnauthorizedPage;
