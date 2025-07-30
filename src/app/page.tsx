import Image from "next/image";

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

      {/* Main content */}
      <main className="flex-1 px-6 py-10 space-y-12">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-sm text-gray-500">Total Sales</p>
            <h2 className="text-2xl font-bold text-green-600">$12,430</h2>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-sm text-gray-500">Orders</p>
            <h2 className="text-2xl font-bold text-blue-600">328</h2>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-sm text-gray-500">Active Products</p>
            <h2 className="text-2xl font-bold text-purple-600">87</h2>
          </div>
        </section>

        {/* Products List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
              >
                <Image
                  src="/placeholder.png"
                  alt="Product"
                  width={500}
                  height={300}
                  className="rounded-xl mb-4"
                />
                <h3 className="font-semibold text-lg">Product #{i + 1}</h3>
                <p className="text-sm text-gray-500">Category Name</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-blue-600 font-bold">$29.99</span>
                  <button className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Store. All rights reserved.
      </footer>
    </div>
  );
}
