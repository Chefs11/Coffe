/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingCart, Plus, Minus, CreditCard, HelpCircle } from 'lucide-react';

export const StudentCart: React.FC = () => {
  const { cart, updateCartItemQuantity, removeProductFromCart, confirmOrder, setTabStudent } = useApp();
  
  // Quick student name retriever from localStorage
  const loggedName = localStorage.getItem('eb_student_name') || 'Mateo García';
  const [customerName, setCustomerName] = useState(loggedName);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const serviceFee = 0.50; // flat service fee
  const total = subtotal > 0 ? subtotal + serviceFee : 0;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    confirmOrder(customerName);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Cart Items list (Left Col - 2/3 wide) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            <div className="p-4 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">Alimentos Seleccionados</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{cart.length} Artículos</span>
            </div>

            {cart.map(item => (
              <div key={item.product.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.product.name}</h4>
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 mt-0.5">
                      ${item.product.price.toFixed(2)} c/u
                    </span>
                  </div>
                </div>

                {/* Operations & Quantity controls */}
                <div className="flex items-center gap-5">
                  <div className="flex items-center border border-gray-100 bg-gray-50 p-1 rounded-xl">
                    <button
                      onClick={() => updateCartItemQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-white text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="px-3 text-xs font-extrabold text-gray-900 w-8 text-center select-none">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateCartItemQuantity(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className={`p-1 hover:bg-white rounded-lg transition-colors ${
                        item.quantity >= item.product.stock 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price and delete button */}
                  <div className="text-right flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-900 min-w-[55px] inline-block">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => removeProductFromCart(item.product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout/Order Summary panel (Right Col - 1/3 wide) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Resumen del Pedido</h4>
              <p className="text-[10px] text-gray-500">Completa tu información antes de confirmar la orden.</p>
            </div>

            <form onSubmit={handleConfirm} className="space-y-4">
              {/* Customer Name Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Nombre del Estudiante
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="ej. Mateo García"
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-100 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C0492B]"
                />
              </div>

              {/* Bill Details */}
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl space-y-2 text-xs font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1">
                    Cargo por Servicio 
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400" title="Cargo plano por embalaje y empaque." />
                  </span>
                  <span className="text-gray-900 font-bold">${serviceFee.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[#C0492B] text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex gap-2.5 bg-amber-50/40 p-3 rounded-xl border border-amber-100/50 text-[10px] text-amber-700">
                <CreditCard className="w-4 h-4 shrink-0 text-[#C0492B]" />
                <p className="leading-snug">
                  Pago contra entrega. Retira tu pedido en barra cuando el monitor indique que tu turno se encuentra <span className="font-bold uppercase">Listo</span>.
                </p>
              </div>

              {/* Confirm order button */}
              <button
                type="submit"
                id="cart-confirm-btn"
                className="w-full py-3 px-4 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                Confirmar Pedido y Retirar
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto bg-white border border-gray-100 p-8 rounded-2xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-gray-900">Tu Pedido está Vacío</h4>
          <p className="text-[10px] text-gray-400 mt-1 mb-6 leading-relaxed">
            Añade algunos alimentos deliciosos de nuestro catálogo estudiantil para comenzar tu orden rápida.
          </p>
          <button
            onClick={() => setTabStudent('catalog')}
            className="px-6 py-2.5 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.97]"
          >
            Explorar Alimentos
          </button>
        </div>
      )}

    </div>
  );
};
