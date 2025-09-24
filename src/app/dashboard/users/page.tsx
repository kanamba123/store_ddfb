"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "Seller" | "Admin" | "Client";
  registeredAt: string;
  salesCount: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Seller",
    salesCount: "",
  });

  useEffect(() => {
    // Simuler un fetch API
    const fetchUsers = () => {
      const data: User[] = [
        {
          id: "USR-001",
          fullName: "Alice Dupont",
          email: "alice.dupont@example.com",
          role: "Seller",
          registeredAt: "2023-01-15",
          salesCount: 120,
        },
        {
          id: "USR-002",
          fullName: "Bob Martin",
          email: "bob.martin@example.com",
          role: "Seller",
          registeredAt: "2022-11-10",
          salesCount: 87,
        },
        {
          id: "USR-003",
          fullName: "Claire Bernard",
          email: "claire.bernard@example.com",
          role: "Seller",
          registeredAt: "2024-03-05",
          salesCount: 45,
        },
        {
          id: "USR-004",
          fullName: "David Morel",
          email: "david.morel@example.com",
          role: "Admin",
          registeredAt: "2021-07-20",
          salesCount: 0,
        },
      ];

      setUsers(data);
    };

    fetchUsers();
  }, []);

  const openModalForNew = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", role: "Seller", salesCount: "" });
    setModalOpen(true);
  };

  const openModalForEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      salesCount: user.salesCount.toString(),
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, email, role, salesCount } = formData;
    if (!fullName || !email || !role || salesCount === "") return;

    if (editingUser) {
      // Modifier
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName,
                email,
                role: role as User["role"],
                salesCount: parseInt(salesCount, 10),
              }
            : u
        )
      );
    } else {
      // Ajouter
      const nextId = `USR-${String(users.length + 1).padStart(3, "0")}`;
      setUsers([
        ...users,
        {
          id: nextId,
          fullName,
          email,
          role: role as User["role"],
          registeredAt: new Date().toISOString().slice(0, 10),
          salesCount: parseInt(salesCount, 10),
        },
      ]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Liste des utilisateurs
      </h1>

      <button
        onClick={openModalForNew}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
      >
        + Ajouter un utilisateur
      </button>

      {users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Chargement des utilisateurs...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden dark:shadow-none">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Nom complet
                </th>
                <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Rôle
                </th>
                <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Inscrit depuis
                </th>
                <th className="text-right px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Ventes réalisées
                </th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 font-mono dark:text-gray-300">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-300">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-300">{user.role}</td>
                  <td className="px-6 py-4 dark:text-gray-300">
                    {new Date(user.registeredAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-right dark:text-gray-300">
                    {user.salesCount}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => openModalForEdit(user)}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                      aria-label={`Modifier ${user.fullName}`}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                      aria-label={`Supprimer ${user.fullName}`}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none max-w-md w-full p-6 relative border dark:border-gray-700">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Fermer modal"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              {editingUser
                ? "Modifier un utilisateur"
                : "Ajouter un utilisateur"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nom complet
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="salesCount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Ventes réalisées
                </label>
                <input
                  id="salesCount"
                  name="salesCount"
                  type="number"
                  min={0}
                  value={formData.salesCount}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 dark:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  {editingUser ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
