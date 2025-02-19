// pages/room.tsx
import React from "react";

const Room = () => {
  // Data dummy untuk ruangan
  const rooms = [
    {
      id: 1,
      name: "Room 101",
      capacity: 4,
      available: true,
    },
    {
      id: 2,
      name: "Room 102",
      capacity: 6,
      available: false,
    },
    {
      id: 3,
      name: "Room 103",
      capacity: 8,
      available: true,
    },
    {
      id: 4,
      name: "Room 104",
      capacity: 10,
      available: false,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Room</h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`bg-white overflow-hidden shadow rounded-lg ${
                  room.available ? "border-green-500 border-2" : "border-red-500 border-2"
                }`}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-12 w-12 ${
                          room.available ? "text-green-500" : "text-red-500"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l-2-2m2 2V4a1 1 0 011-1h3m-6 9l2-2 2 2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {room.name}
                        </dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">
                          Capacity: {room.capacity}
                        </dd>
                        <dd className="mt-1">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              room.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.available ? "Available" : "Not Available"}
                          </span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;