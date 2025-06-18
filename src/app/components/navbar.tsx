"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Tambahkan state untuk mount status
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Set mounted setelah render di client
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(true);
    router.push('/login');
  };

  // Jika belum mounted, render null atau skeleton
  if (!isMounted) {
    return null;
    // Atau bisa return skeleton loading:
    // return <div className="h-20 bg-gray-200"></div>;
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-white font-bold cursor-pointer">
            Van's app
          </Link>

          {/* Menu Items - Hanya render setelah mounted */}
          {isLoggedIn && (
            <div className="hidden md:flex space-x-6">
              <Link href="/Dashboard" className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
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
          )}

          {/* Account Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <button className="flex items-center space-x-1 px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold">
                      U
                    </div>
                    <span>Profile</span>
                  </button>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-white text-white rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 border border-white text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;