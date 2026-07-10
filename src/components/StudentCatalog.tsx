/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ShoppingCart, Compass, Check, AlertCircle } from 'lucide-react';

export const StudentCatalog: React.FC = () => {
  const { products, addProductToCart, cart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Categories list
  const categories = ['Todos', 'Comida Rápida', 'Ensaladas', 'Bebidas'];

  // Only display active products in catalog
  const activeProducts = products.filter(p => p.isActive);

  // Filter products by active selection
  const filteredProducts = selectedCategory === 'Todos'
    ? activeProducts
    : activeProducts.filter(p => p.category === selectedCategory);

  const handleAddToCart = (p: Product) => {
    addProductToCart(p);
    
    // Quick success click feedback animation
    setAddedAnimationId(p.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  const getCartQuantityForProduct = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Category Pills Slider Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-[#C0492B] text-white border-[#C0492B] shadow-sm'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-100 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => {
            const isOutOfStock = p.stock === 0;
            const cartQty = getCartQuantityForProduct(p.id);
            const isLimitReached = cartQty >= p.stock;

            return (
              <div 
                key={p.id}
                id={`product-card-${p.id}`}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 ${
                  isOutOfStock 
                    ? 'border-gray-100 opacity-65' 
                    : 'border-gray-100 hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Product image with category sticker overlay */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Category overlay label */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border border-gray-100 shadow-sm">
                    {p.category}
                  </span>

                  {/* Out of stock/low stock labels */}
                  {isOutOfStock ? (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Agotado por hoy
                      </span>
                    </div>
                  ) : p.stock <= 5 ? (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg shadow-sm">
                      Últimas {p.stock} uds
                    </span>
                  ) : null}
                </div>

                {/* Card body content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-normal" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  {/* Price and Cart Operations button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-gray-900">${p.price.toFixed(2)}</span>

                    {isOutOfStock ? (
                      <button
                        disabled
                        className="px-3.5 py-2 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-xl cursor-not-allowed"
                      >
                        No Disponible
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={isLimitReached}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-200 active:scale-[0.96] ${
                          addedAnimationId === p.id
                            ? 'bg-green-600 text-white'
                            : isLimitReached
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#C0492B] hover:bg-[#A3381F] text-white shadow-sm'
                        }`}
                      >
                        {addedAnimationId === p.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            ¡Agregado!
                          </>
                        ) : isLimitReached ? (
                          'Límite de Stock'
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Agregar
                            {cartQty > 0 && (
                              <span className="bg-white/20 px-1 py-0.5 rounded text-[9px] font-extrabold ml-1">
                                {cartQty}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 bg-white border border-gray-100 rounded-2xl p-8 max-w-md mx-auto">
          <Compass className="w-10 h-10 text-gray-300 mb-2.5" />
          <p className="text-xs font-semibold text-gray-600">No se encontraron productos</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Actualmente no existen alimentos disponibles en esta categoría.</p>
        </div>
      )}

    </div>
  );
};
