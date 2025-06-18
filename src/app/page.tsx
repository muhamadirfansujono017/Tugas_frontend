"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            Sistem Manajemen Ruangan
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md">
                Masuk
              </button>
            </Link>
            <Link href="/register">
              <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-md">
                Daftar
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-pink-700 mb-6">
            Selamat Datang di Sistem Manajemen Ruangan
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Kelola ruangan, booking, dan laporan dengan mudah dalam satu platform terintegrasi.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/rooms">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium">
                Kelola Ruangan
              </button>
            </Link>
            <Link href="/bookings">
              <button className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-full shadow-lg hover:bg-indigo-50 transition-all font-medium">
                Booking Sekarang
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Fitur Utama Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 6l9-3 9 3"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Kelola Ruangan</h4>
              <p className="text-gray-600 mt-2">
                Tambah, edit, dan hapus ruangan dengan mudah melalui antarmuka yang intuitif.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Booking Ruangan</h4>
              <p className="text-gray-600 mt-2">
                Pesan ruangan sesuai kebutuhan Anda dengan beberapa klik saja.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">Laporan</h4>
              <p className="text-gray-600 mt-2">
                Lihat laporan penggunaan ruangan secara real-time untuk analisis lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-sm font-medium">
            &copy; 2025 Sistem Manajemen Ruangan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}