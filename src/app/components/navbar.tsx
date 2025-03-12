"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-white font-bold cursor-pointer">
            irfan app
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/users" className="text-gray-300 hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  User
                </Link>
                <Link href="/rooms" className="text-gray-300 hover:bg-green-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Room
                </Link>

            {/* Dropdown for Transaction */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center cursor-pointer"
              >
                Transaction
                <svg
                  className="ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link
                    href="/booking"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Booking
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
     
    </nav>
  );
};

export default Navbar;