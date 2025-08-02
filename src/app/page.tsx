

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-600">Store Dashboard</h1>
        <div className="space-x-4">
          <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            Add Product
          </button>
          <button className="text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300">
            Logout
          </button>
        </div>
      </header>

     

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Store. All rights reserved.
      </footer>
    </div>
  );
}
