'use client';

import { useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'MacBook Pro 16"', price: 2499, stock: 10 },
    { id: 2, name: 'iPhone 15 Pro', price: 1199, stock: 25 },
    { id: 3, name: 'AirPods Pro 2', price: 249, stock: 40 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [filterText, setFilterText] = useState(''); // Pour le filtre

  const openModalForNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '' });
    setModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
              }
            : p
        )
      );
    } else {
      const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([
        ...products,
        {
          id: nextId,
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
        },
      ]);
    }

    closeModal();
  };

  // Filtrage des produits selon filterText
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Produits</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filterText}
          onChange={handleFilterChange}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={openModalForNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Liste des produits filtrés */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 border border-gray-200 relative"
            >
              <h3 className="font-semibold text-lg text-gray-700">{product.name}</h3>
              <p className="text-sm text-gray-500">Prix: {product.price} €</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>

              <button
                onClick={() => openModalForEdit(product)}
                className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Modifier
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun produit trouvé.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Fermer modal"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du produit
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Prix (€)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                {editingProduct ? 'Enregistrer les modifications' : 'Ajouter produit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
