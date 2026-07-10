/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { ChefHat, CheckSquare, PackageCheck, Utensils, Award } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();

  // Active orders are those in 'PREPARING' or 'READY'
  const activeOrders = orders.filter(o => o.status === 'PREPARING' || o.status === 'READY');
  
  // Reverse chronological list of active orders to calculate virtual queue size
  const preparingOrders = activeOrders.filter(o => o.status === 'PREPARING').reverse(); // oldest first
  const readyOrders = activeOrders.filter(o => o.status === 'READY').reverse(); // oldest first

  // We want to calculate the "Fila virtual" (virtual index of an order)
  // For preparing, the position is its index in preparing list.
  const getQueuePosition = (orderId: string, status: OrderStatus) => {
    if (status === 'PREPARING') {
      const idx = preparingOrders.findIndex(o => o.id === orderId);
      return idx !== -1 ? idx + 1 : 1;
    }
    return 0; // ready orders are at front
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header text */}
      <div>
        <h3 className="text-xs font-bold text-gray-900">Control de Producción de Cocina</h3>
        <p className="text-[10px] text-gray-500">Administra los tiempos de preparación y despacha los pedidos listos.</p>
      </div>

      {/* Main columns grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Column 1: En Preparación */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-amber-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <ChefHat className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">En Preparación</h4>
                <p className="text-[9px] text-gray-500">Ordenes siendo procesadas por el chef.</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              {preparingOrders.length} Cola
            </span>
          </div>

          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto bg-gray-50/20">
            {preparingOrders.length > 0 ? (
              preparingOrders.map((o, idx) => {
                const pos = idx + 1;
                return (
                  <div key={o.id} className="bg-white p-4.5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-gray-900">Turno #{o.turnNumber}</span>
                          <span className="text-[10px] text-gray-400 font-medium">({o.id})</span>
                        </div>
                        <h5 className="text-[10px] font-bold text-gray-500 mt-0.5">{o.customerName}</h5>
                      </div>

                      {/* Fila virtual position */}
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                        {pos === 1 ? 'Siguiente en cola' : `${pos}º en fila`}
                      </span>
                    </div>

                    {/* Order items list */}
                    <div className="py-2.5 border-t border-b border-gray-50 space-y-1">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-800">
                            {item.quantity}x <span className="font-medium text-gray-600">{item.name}</span>
                          </span>
                          <span className="text-gray-400 text-[10px]">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Total & Next Action button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Total</span>
                        <span className="text-xs font-bold text-gray-900">${o.total.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={() => updateOrderStatus(o.id, 'READY')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#C0492B] hover:bg-[#A3381F] text-white text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-[0.97]"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Marcar Listo
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <Utensils className="w-9 h-9 text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-500">No hay pedidos en preparación</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Los nuevos pedidos de estudiantes llegarán aquí.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Listo para Recoger */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-green-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Listos para Retirar</h4>
                <p className="text-[9px] text-gray-500">Pedidos listos esperando entrega en mostrador.</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
              {readyOrders.length} Listos
            </span>
          </div>

          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto bg-gray-50/20">
            {readyOrders.length > 0 ? (
              readyOrders.map((o) => (
                <div key={o.id} className="bg-white p-4.5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">Turno #{o.turnNumber}</span>
                        <span className="text-[10px] text-gray-400 font-medium">({o.id})</span>
                      </div>
                      <h5 className="text-[10px] font-bold text-gray-500 mt-0.5">{o.customerName}</h5>
                    </div>

                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-lg animate-pulse">
                      Esperando recogida
                    </span>
                  </div>

                  {/* Order items list */}
                  <div className="py-2.5 border-t border-b border-gray-50 space-y-1">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-gray-800">
                          {item.quantity}x <span className="font-medium text-gray-600">{item.name}</span>
                        </span>
                        <span className="text-gray-400 text-[10px]">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total & Next Action button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Total</span>
                      <span className="text-xs font-bold text-gray-900">${o.total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => updateOrderStatus(o.id, 'DELIVERED')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-all active:scale-[0.97]"
                    >
                      <PackageCheck className="w-4 h-4" />
                      Marcar Entregado
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                <CheckSquare className="w-9 h-9 text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-500">No hay pedidos listos</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Marca un pedido como "Listo" para pasarlo aquí.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
