// components/navbar.tsx
"use client"; // Tambahkan ini untuk Client Component

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname(); // Mendapatkan rute aktif

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 cursor-pointer">
                Irfan App
              </span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-6">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/dashboard" ? "text-white underline underline-offset-4 decoration-yellow-300" : ""
              }`}
            >
              Dashboard
            </Link>

            {/* Room Link */}
            <Link
              href="/room"
              className={`hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/room" ? "text-white underline underline-offset-4 decoration-yellow-300" : ""
              }`}
            >
              Room
            </Link>

            {/* User Link */}
            <Link
              href="/user"
              className={`hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/user" ? "text-white underline underline-offset-4 decoration-yellow-300" : ""
              }`}
            >
              User
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
                    href="/transaction/booking"
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