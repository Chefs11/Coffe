/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Edit2, Check, X, AlertTriangle, PlusCircle, Trash } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateProduct, setProducts } = useApp();
  
  // Track which row is being edited inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');

  // Add new product state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCategory, setNewCategory] = useState('Comida Rápida');
  const [newDescription, setNewDescription] = useState('');

  const startEditing = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
    setEditName(p.name);
    setEditCategory(p.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (id: string) => {
    const parsedPrice = parseFloat(editPrice);
    const parsedStock = parseInt(editStock, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0) return;
    if (isNaN(parsedStock) || parsedStock < 0) return;

    updateProduct(id, {
      name: editName,
      category: editCategory,
      price: Number(parsedPrice.toFixed(2)),
      stock: parsedStock,
    });
    setEditingId(null);
  };

  const toggleProductActive = (id: string, currentStatus: boolean) => {
    updateProduct(id, { isActive: !currentStatus });
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(newPrice);
    const parsedStock = parseInt(newStock, 10);

    if (!newName.trim()) return;
    if (isNaN(parsedPrice) || parsedPrice < 0) return;
    if (isNaN(parsedStock) || parsedStock < 0) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newName,
      description: newDescription || 'Delicioso producto disponible en cafetería.',
      price: Number(parsedPrice.toFixed(2)),
      stock: parsedStock,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', // generic salad image fallback
      isActive: true,
    };

    setProducts(prev => [...prev, newProduct]);
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewCategory('Comida Rápida');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Table Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900">Catálogo de Inventario</h3>
          <p className="text-[10px] text-gray-500">Configura precios, activa o desactiva productos y controla las existencias.</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Agregar Nuevo Producto
        </button>
      </div>

      {/* Add New Product Panel Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
            <h4 className="text-xs font-bold text-gray-900">Nuevo Producto de Cafetería</h4>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-900">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddNewProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nombre</label>
              <input
                type="text"
                required
                placeholder="ej. Wrap de Pollo Parmesano"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Categoría</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs"
              >
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Ensaladas">Ensaladas</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="ej. 7.50"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Stock Inicial</label>
              <input
                type="number"
                required
                placeholder="ej. 20"
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Descripción Corta</label>
              <input
                type="text"
                placeholder="Ingredientes clave o tamaño de la porción..."
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2.5 pt-3 border-t border-gray-50">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-900 text-xs font-semibold rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl transition-all"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100">
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Imagen</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Producto</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Categoría</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Precio</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Venta Activa</th>
                <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => {
                const isEditing = editingId === p.id;
                const isOutOfStock = p.stock === 0;

                return (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-gray-50/40 transition-colors ${isOutOfStock ? 'bg-red-50/20' : ''}`}
                  >
                    {/* Product image */}
                    <td className="px-6 py-4">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0" 
                      />
                    </td>

                    {/* Product Name & Details */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="px-2.5 py-1.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 w-full"
                        />
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">{p.name}</span>
                          <span className="text-[10px] text-gray-400 font-medium truncate block max-w-xs">{p.description}</span>
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value)}
                          className="px-2 py-1.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs text-gray-700"
                        >
                          <option value="Comida Rápida">Comida Rápida</option>
                          <option value="Ensaladas">Ensaladas</option>
                          <option value="Bebidas">Bebidas</option>
                        </select>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[9px] font-bold">
                          {p.category}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="relative max-w-[80px]">
                          <span className="text-xs text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="pl-5 pr-2 py-1.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-bold text-gray-900 w-full"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-900">${p.price.toFixed(2)}</span>
                      )}
                    </td>

                    {/* Stock level */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(e.target.value)}
                          className="px-2.5 py-1.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-xs font-bold text-gray-900 w-20"
                        />
                      ) : (
                        <div>
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100/50 px-2.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Agotado
                            </span>
                          ) : (
                            <span className={`text-xs font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>
                              {p.stock} uds
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Venta Activa Switch */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleProductActive(p.id, p.isActive)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          p.isActive ? 'bg-[#C0492B]' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            p.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => saveEditing(p.id)}
                            title="Confirmar cambios"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            title="Descartar cambios"
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(p)}
                          title="Editar Fila"
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
