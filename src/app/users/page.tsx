"use client";

import { useState, useMemo, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const pageSize = 5;

  useEffect(() => {
    // Fetch initial data from users.json
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = users.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, sortBy, sortOrder, users]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle adding or updating a user
  const handleSaveUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Nama dan email harus diisi!");
      return;
    }

    if (editingUserId !== null) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUserId ? { ...user, ...newUser } : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
      const newUserToAdd = { id: newId, ...newUser };
      setUsers((prevUsers) => [...prevUsers, newUserToAdd]);
    }

    // Reset form and close modal
    setNewUser({ name: "", email: "" });
    setEditingUserId(null);
    setIsModalOpen(false);
  };

  // Handle editing a user
  const handleEditUser = (id: number) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setNewUser(userToEdit);
      setEditingUserId(id);
      setIsModalOpen(true);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  // Open modal for new user
  const openNewUserModal = () => {
    setNewUser({ name: "", email: "" });
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">DAFTAR USER</h1>

      {/* Search bar and Add User button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="p-2 border rounded w-1/2"
        />
        <button
          onClick={openNewUserModal}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tambah User
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("id")}
            >
              ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Nama {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email{" "}
              {sortBy === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingUserId !== null ? "Edit Pengguna" : "Tambah Pengguna"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nama</label>
                <input
                  type="text"
                  placeholder="Nama"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUserId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {editingUserId !== null ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}