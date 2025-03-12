"use client";
import { useState, useEffect } from "react";

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  available: boolean;
}

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    capacity: 0,
    available: true,
  });
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // Fetch data from rooms.json
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("Fetching rooms from /rooms.json"); // Debugging
        const response = await fetch("/rooms.json");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data: Room[] = await response.json();
        console.log("Fetched rooms:", data); // Debugging
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  // Filter rooms based on search term and availability
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = !filterAvailable || room.available;
    return matchesSearch && matchesAvailability;
  });

  // Handle adding or updating a room
  const handleSaveRoom = () => {
    if (!newRoom.name || !newRoom.description || newRoom.capacity <= 0) {
      alert("Semua field harus diisi dengan benar!");
      return;
    }

    if (editingRoomId !== null) {
      // Update existing room
      const updatedRooms = rooms.map((room) =>
        room.id === editingRoomId ? { ...room, ...newRoom } : room
      );
      setRooms(updatedRooms);
      setEditingRoomId(null);
    } else {
      // Add new room
      const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      const newRoomToAdd = { id: newId, ...newRoom };
      setRooms((prevRooms) => [...prevRooms, newRoomToAdd]);
    }

    setNewRoom({ name: "", description: "", capacity: 0, available: true }); // Reset form
  };

  // Handle editing a room
  const handleEditRoom = (id: number) => {
    const roomToEdit = rooms.find((room) => room.id === id);
    if (roomToEdit) {
      setNewRoom(roomToEdit);
      setEditingRoomId(id);
    }
  };

  // Handle deleting a room
  const handleDeleteRoom = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) {
      const updatedRooms = rooms.filter((room) => room.id !== id);
      setRooms(updatedRooms);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Room List</h1>

      {/* Form for adding/editing a room */}
      <div className="mb-6 bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          {editingRoomId !== null ? "Edit Ruangan" : "Tambah Ruangan Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Ruangan"
            value={newRoom.name}
            onChange={(e) =>
              setNewRoom({ ...newRoom, name: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Deskripsi"
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Kapasitas"
            value={newRoom.capacity}
            onChange={(e) =>
              setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })
            }
            className="p-2 border border-gray-300 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newRoom.available}
              onChange={(e) =>
                setNewRoom({ ...newRoom, available: e.target.checked })
              }
              className="form-checkbox"
            />
            Available
          </label>
        </div>
        <button
          onClick={handleSaveRoom}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {editingRoomId !== null ? "Simpan Perubahan" : "Tambah Ruangan"}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by room name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.checked)}
            className="form-checkbox"
          />
          Show only available rooms
        </label>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border rounded-lg ${
                room.available ? "border-green-500" : "border-red-500"
              }`}
            >
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-gray-600 mt-2">{room.description}</p>
              <div className="mt-4">
                <p>
                  <strong>Capacity:</strong> {room.capacity} people
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      room.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {room.available ? "Available" : "Not Available"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditRoom(room.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No rooms found.</p>
        )}
      </div>
    </div>
  );
}