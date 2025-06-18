"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface Room {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  capacity: number;
  description: string;
  status: "available" | "booked" | "maintenance";
}

interface FormData {
  name: string;
  categoryId: number;
  price: number;
  capacity: number;
  description: string;
  status: "available" | "booked" | "maintenance";
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    categoryId: 1,
    price: 0,
    capacity: 0,
    description: "",
    status: "available",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Kategori dinamis
  const [categories, setCategories] = useState<Record<number, string>>({
    1: "Meeting Room",
    2: "Auditorium",
    3: "Training Room",
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) return "Nama ruangan wajib diisi";
    if (formData.price <= 0) return "Harga harus lebih dari 0";
    if (formData.capacity <= 0) return "Kapasitas harus lebih dari 0";
    return "";
  }, [formData]);

  const getAccessToken = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Sesi tidak valid. Silakan login kembali.");
      return null;
    }
    return token;
  }, []);

  const fetchRooms = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/rooms",  {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const { data } = await response.json();

      if (data) {
        setRooms(data);
      } else {
        setError("Tidak ada data ruangan yang ditemukan");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(`Gagal memuat data ruangan: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [getAccessToken]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["categoryId", "price", "capacity"].includes(name)
        ? parseInt(value, 10)
        : value,
    }));
    setFormError("");
  };

  const handleStatusChange = (
    status: "available" | "booked" | "maintenance"
  ) => {
    setFormData((prev) => ({ ...prev, status }));
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://simaru.amisbudi.cloud/api/rooms", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setMessage("Ruangan berhasil ditambahkan");
      setIsSuccess(true);
      resetForm();
      setIsOpen(false);
      await fetchRooms();

    } catch (err: any) {
      setError(`Gagal menambah ruangan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentRoomId) return;

      const validationError = validateForm();
      if (validationError) {
        setFormError(validationError);
        return;
      }

      const token = getAccessToken();
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://simaru.amisbudi.cloud/api/rooms/${currentRoomId}`, 
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `HTTP ${response.status}`);
        }

        const result = await response.json();
        setMessage("Ruangan berhasil diperbarui");
        setIsSuccess(true);
        setRooms((prev) =>
          prev.map((r) => (r.id === currentRoomId ? result.data : r))
        );
        setIsEdit(false);
        resetForm();
        await fetchRooms();

      } catch (err: any) {
        setError(`Gagal memperbarui ruangan: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [currentRoomId, formData, validateForm, getAccessToken, fetchRooms]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) return;

      const token = getAccessToken();
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://simaru.amisbudi.cloud/api/rooms/${id}`, 
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `HTTP ${response.status}`);
        }

        const { message: apiMessage } = await response.json();
        setMessage(apiMessage || "Ruangan berhasil dihapus");
        setIsSuccess(true);
        await fetchRooms();

      } catch (err: any) {
        setError(`Gagal menghapus ruangan: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [getAccessToken, fetchRooms]
  );

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      categoryId: 1,
      price: 0,
      capacity: 0,
      description: "",
      status: "available",
    });
    setCurrentRoomId(null);
    setFormError("");
  }, []);

  const setupEditForm = useCallback((room: Room) => {
    setFormData({
      name: room.name,
      categoryId: room.categoryId,
      price: room.price,
      capacity: room.capacity,
      description: room.description,
      status: room.status,
    });
    setCurrentRoomId(room.id);
    setIsEdit(true);
    setFormError("");
  }, []);

  const setupStatusForm = useCallback((room: Room) => {
    setFormData((prev) => ({ ...prev, status: room.status }));
    setCurrentRoomId(room.id);
    setIsStatusModalOpen(true);
    setFormError("");
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setFormError("Nama kategori tidak boleh kosong");
      return;
    }

    const categoryExists = Object.values(categories).some(
      (name) => name.toLowerCase() === trimmed.toLowerCase()
    );
    if (categoryExists) {
      setFormError("Kategori sudah ada");
      return;
    }

    const newId = Math.max(...Object.keys(categories).map(Number)) + 1;
    setCategories((prev) => ({
      ...prev,
      [newId]: trimmed,
    }));

    setNewCategoryName("");
    setFormError("");
  };

  useEffect(() => {
    fetchRooms();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRooms]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* Notifications */}
      {isSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-between max-w-sm animate-fade-in">
          <span>{message}</span>
          <button onClick={() => setIsSuccess(false)} className="ml-4 hover:text-gray-200">
            ✕
          </button>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-between max-w-sm">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 hover:text-gray-200">
            ✕
          </button>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Ruangan</h1>
          <p className="text-gray-600">Kelola daftar ruangan yang tersedia</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition disabled:opacity-50"
          disabled={isLoading}
        >
          + Tambah Ruangan
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari ruangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">ID</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Nama Ruangan</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Kategori</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Harga</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Kapasitas</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Status</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">{room.id}</td>
                      <td className="py-3 px-4 border-b font-medium">{room.name}</td>
                      <td className="py-3 px-4 border-b">
                        {categories[room.categoryId] || "Lainnya"}
                      </td>
                      <td className="py-3 px-4 border-b">
                        Rp {room.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b">{room.capacity} orang</td>
                      <td className="py-3 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            room.status === "available"
                              ? "bg-green-100 text-green-800"
                              : room.status === "booked"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.status === "available"
                            ? "Tersedia"
                            : room.status === "booked"
                            ? "Dibooking"
                            : "Maintenance"}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setupEditForm(room)}
                            className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setupStatusForm(room)}
                            className="text-purple-600 hover:text-purple-800 text-sm disabled:opacity-50"
                            disabled={isLoading}
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                            disabled={isLoading}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Tidak ada data ruangan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isOpen || isEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit Ruangan" : "Tambah Ruangan Baru"}
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsEdit(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="p-4 space-y-4">
              {/* Tambah Kategori Manual */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tambah Kategori
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setFormError("");
                    }}
                    placeholder="Contoh: Kelas Virtual"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={isLoading}
                  >
                    Tambah
                  </button>
                </div>
                {formError && (
                  <p className="mt-1 text-red-500 text-sm">{formError}</p>
                )}
              </div>

              {/* Form Fields */}
              {formError && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Ruangan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                    disabled={isLoading}
                  >
                    {Object.entries(categories).map(([id, name]) => (
                      <option key={id} value={parseInt(id)}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per Jam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: "available", label: "Tersedia", color: "text-green-500" },
                    { value: "booked", label: "Dibooking", color: "text-yellow-500" },
                    { value: "maintenance", label: "Maintenance", color: "text-red-500" },
                  ].map((status) => (
                    <label key={status.value} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={() => handleStatusChange(status.value as "available" | "booked" | "maintenance")}
                        className={`form-radio h-4 w-4 ${status.color}`}
                        disabled={isLoading}
                      />
                      <span className="ml-2">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsEdit(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Ubah Status Ruangan</h2>
              <button
                onClick={() => {
                  setIsStatusModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {formError && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm mb-4">
                  {formError}
                </div>
              )}
              <div className="space-y-3 mb-6">
                {[
                  { value: "available", label: "Tersedia", desc: "Ruangan dapat dipesan" },
                  { value: "booked", label: "Dibooking", desc: "Ruangan sedang digunakan" },
                  { value: "maintenance", label: "Maintenance", desc: "Ruangan dalam perbaikan" },
                ].map((status) => (
                  <label key={status.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={() => handleStatusChange(status.value as "available" | "booked" | "maintenance")}
                      className={`h-5 w-5 ${status.value === "available"
                        ? "text-green-500"
                        : status.value === "booked"
                        ? "text-yellow-500"
                        : "text-red-500"
                      }`}
                      disabled={isLoading}
                    />
                    <div>
                      <span className="font-medium">{status.label}</span>
                      <p className="text-sm text-gray-500">{status.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!currentRoomId) return;
                    const token = getAccessToken();
                    if (!token) return;
                    setIsLoading(true);
                    try {
                      const payload = { status: formData.status };
                      const res = await fetch(
                        `https://simaru.amisbudi.cloud/api/rooms/${currentRoomId}`, 
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(payload),
                        }
                      );

                      if (!res.ok) {
                        const text = await res.text();
                        throw new Error(text || `HTTP ${res.status}`);
                      }

                      const result = await res.json();
                      setMessage("Status ruangan berhasil diperbarui");
                      setIsSuccess(true);
                      setIsStatusModalOpen(false);
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === currentRoomId ? { ...r, status: result.data.status } : r
                        )
                      );
                      resetForm();
                    } catch (err: any) {
                      setError(`Gagal memperbarui status: ${err.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Memperbarui..." : "Perbarui Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
