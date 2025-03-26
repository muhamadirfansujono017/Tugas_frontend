"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: number;
  room: string;
  user: string;
  date: string;
  status: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    room: "",
    user: "",
    date: "",
    status: "Pending",
  });
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);

  // Fetch data from bookings.json
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/bookings.json");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle adding or updating a booking
  const handleSaveBooking = () => {
    if (!newBooking.room || !newBooking.user || !newBooking.date) {
      alert("Semua field harus diisi!");
      return;
    }

    if (editingBookingId !== null) {
      // Update existing booking
      const updatedBookings = bookings.map((booking) =>
        booking.id === editingBookingId ? { ...booking, ...newBooking } : booking
      );
      setBookings(updatedBookings);
    } else {
      // Add new booking
      const newId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
      const newBookingToAdd = { id: newId, ...newBooking };
      setBookings((prevBookings) => [...prevBookings, newBookingToAdd]);
    }

    // Reset form and close modal
    setNewBooking({ room: "", user: "", date: "", status: "Pending" });
    setEditingBookingId(null);
    setIsModalOpen(false);
  };

  // Handle editing a booking
  const handleEditBooking = (id: number) => {
    const bookingToEdit = bookings.find((booking) => booking.id === id);
    if (bookingToEdit) {
      setNewBooking(bookingToEdit);
      setEditingBookingId(id);
      setIsModalOpen(true);
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus booking ini?")) {
      const updatedBookings = bookings.filter((booking) => booking.id !== id);
      setBookings(updatedBookings);
    }
  };

  // Open modal for new booking
  const openNewBookingModal = () => {
    setNewBooking({ room: "", user: "", date: "", status: "Pending" });
    setEditingBookingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking List</h1>
        <button
          onClick={openNewBookingModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tambah Booking
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by room or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.room}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBooking(booking.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Booking */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingBookingId !== null ? "Edit Booking" : "Tambah Booking Baru"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nama Ruangan</label>
                <input
                  type="text"
                  placeholder="Nama Ruangan"
                  value={newBooking.room}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, room: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={newBooking.user}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, user: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1">Tanggal</label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, date: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1">Status</label>
                <select
                  value={newBooking.status}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, status: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBookingId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveBooking}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingBookingId !== null ? "Simpan Perubahan" : "Tambah Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}