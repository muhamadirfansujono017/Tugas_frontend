"use client";
import { useState } from "react";

// Interface untuk pengguna
interface User {
  id: number;
  username: string;
  password: string;
}

export default function AuthPage() {
  // Daftar pengguna (simulasi data dari backend)
  const users: User[] = [
    { id: 1, username: "admin", password: "admin123" },
    { id: 2, username: "user", password: "user123" },
  ];

  // State untuk mengelola status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // State untuk form login
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login
  const handleLogin = () => {
    const { username, password } = formData;

    // Cari pengguna yang sesuai dengan username dan password
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      alert(`Selamat datang, ${user.username}!`);
    } else {
      alert("Username atau password salah!");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    alert("Anda telah logout.");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Login and Logout</h1>

      {/* Form Login */}
      {!isLoggedIn ? (
        <div className="bg-white p-6 shadow rounded-lg max-w-md">
          <h2 className="text-lg font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Masukkan username"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Masukkan password"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        </div>
      ) : (
        // Tampilan jika sudah login
        <div className="bg-white p-6 shadow rounded-lg max-w-md">
          <h2 className="text-lg font-semibold mb-4">
            Selamat datang, {currentUser?.username}!
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}