"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Room {
  id: number;
  name: string;
}

interface Booking {
  id: number;
  bookingDate: string;
  roomId: number;
  room?: Room;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const showSuccessAlert = (message: string) => {
    Swal.fire({
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      position: "top-end",
      toast: true,
    });
  };

  const showErrorAlert = (message: string) => {
    Swal.fire({
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      position: "top-end",
      toast: true,
    });
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const result = await response.json();
      if (result?.data) setRooms(result.data);
    } catch (error) {
      showErrorAlert("Gagal memuat data ruangan");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/bookings", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      const result = await response.json();
      if (result?.data) setBookings(result.data);
    } catch (error) {
      showErrorAlert("Gagal memuat data booking");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !bookingDate) {
      showErrorAlert("Harap isi semua field");
      return;
    }

    try {
      const url = isEdit && editingId
        ? `https://simaru.amisbudi.cloud/api/bookings/${editingId}`
        : "https://simaru.amisbudi.cloud/api/bookings";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ 
          bookingDate, 
          roomId: selectedRoomId 
        }),
      });

      const result = await response.json();
      if (response.ok) {
        showSuccessAlert(
          isEdit ? "Booking berhasil diupdate" : "Booking berhasil dibuat"
        );
        setIsOpen(false);
        setIsEdit(false);
        setBookingDate("");
        setSelectedRoomId(null);
        setEditingId(null);
        fetchBookings();
      } else {
        throw new Error(result.message || "Gagal menyimpan booking");
      }
    } catch (err) {
      showErrorAlert(err instanceof Error ? err.message : "Gagal menyimpan booking");
    }
  };

  const handleEdit = (booking: Booking) => {
    setBookingDate(booking.bookingDate);
    setSelectedRoomId(booking.roomId);
    setEditingId(booking.id);
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan booking yang telah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (isConfirmed) {
      try {
        const response = await fetch(
          `https://simaru.amisbudi.cloud/api/bookings/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        if (response.ok) {
          showSuccessAlert("Booking berhasil dihapus");
          fetchBookings();
        } else {
          throw new Error("Gagal menghapus booking");
        }
      } catch (err) {
        showErrorAlert("Gagal menghapus booking");
      }
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen p-8 pl-16 pr-16 bg-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Booking Ruangan</h1>
        <button
          onClick={() => {
            setIsOpen(true);
            setIsEdit(false);
            setEditingId(null);
            setBookingDate("");
            setSelectedRoomId(null);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          Buat Booking
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border">No</th>
                <th className="py-2 px-4 border">Ruangan</th>
                <th className="py-2 px-4 border">Tanggal Booking</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                const room = rooms.find((r) => r.id === booking.roomId);
                return (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-4 border text-center">
                      {room?.name || `Ruangan ID: ${booking.roomId}`}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {new Date(booking.bookingDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEdit ? "Edit Booking" : "Tambah Booking"}
                </h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsEdit(false);
                    setEditingId(null);
                  }}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal Booking
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ruangan
                    </label>
                    <select
                      value={selectedRoomId || ""}
                      onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Pilih Ruangan</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false);
                      setEditingId(null);
                    }}
                    className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="text-white ms-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {isEdit ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;