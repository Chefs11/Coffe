/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export const StudentOrderStatus: React.FC = () => {
  const { orders, currentStudentOrder, setTabStudent } = useApp();

  // Retrieve the freshest copy of the active order from the main orders list
  const activeOrder = currentStudentOrder 
    ? orders.find(o => o.id === currentStudentOrder.id) 
    : null;

  // Calculate virtual queue size (orders ahead in PREPARING)
  const getOrdersAheadCount = () => {
    if (!activeOrder || activeOrder.status !== 'PREPARING') return 0;
    
    // Get all PREPARING orders, oldest first (reverse chronological order)
    const preparingOrders = orders.filter(o => o.status === 'PREPARING').reverse();
    const myIndex = preparingOrders.findIndex(o => o.id === activeOrder.id);
    
    // index is the number of orders ahead
    return myIndex !== -1 ? myIndex : 0;
  };

  const ordersAhead = getOrdersAheadCount();

  return (
    <div className="max-w-md mx-auto font-sans select-none text-center">
      
      {activeOrder ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6">
          
          {/* Section 1: Big Turn Number */}
          <div className="space-y-1.5 pb-5 border-b border-gray-50">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu Turno de Recogida</span>
            <div className="inline-flex items-center justify-center bg-gray-50 border border-gray-100 rounded-3xl px-8 py-5">
              <h2 className="text-4xl font-extrabold text-[#C0492B] tracking-tight">
                {activeOrder.turnNumber}
              </h2>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">ID del Pedido: {activeOrder.id}</p>
          </div>

          {/* Section 2: Real-time Status Card */}
          <div className="space-y-4">
            
            {/* PREPARING STATE */}
            {activeOrder.status === 'PREPARING' && (
              <div className="space-y-3.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">En Preparación</h3>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-1">
                    Nuestro equipo culinario está preparando tus alimentos frescos con cuidado.
                  </p>
                </div>

                {/* Queue status badge */}
                <div className="bg-amber-50/50 border border-amber-100/50 p-3 rounded-xl">
                  {ordersAhead > 0 ? (
                    <p className="text-[10px] font-semibold text-amber-800">
                      Hay <span className="font-bold">{ordersAhead}</span> {ordersAhead === 1 ? 'pedido' : 'pedidos'} por delante en la fila.
                    </p>
                  ) : (
                    <p className="text-[10px] font-bold text-amber-800 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      ¡Tu pedido es el siguiente en cocina!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* READY STATE */}
            {activeOrder.status === 'READY' && (
              <div className="space-y-3.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 border border-green-100">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-green-700">¡Listo para Recoger!</h3>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-1">
                    Acércate a la barra central de la cafetería con el turno <span className="font-bold text-gray-900">{activeOrder.turnNumber}</span> para retirar tus productos.
                  </p>
                </div>

                <div className="bg-green-50/50 border border-green-100 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-green-800 animate-pulse">
                    Listo en mostrador central • ¡Retira ya!
                  </p>
                </div>
              </div>
            )}

            {/* DELIVERED STATE */}
            {activeOrder.status === 'DELIVERED' && (
              <div className="space-y-3.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700">¡Pedido Entregado!</h3>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-1">
                    Esperamos que disfrutes de tu comida. Tu transacción ha sido facturada exitosamente.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-500">
                    ¡Buen provecho! 😋
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Section 3: Summary details */}
          <div className="pt-5 border-t border-gray-50 space-y-2 text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Detalle de la Orden</span>
            <div className="space-y-1 bg-gray-50/60 border border-gray-50 p-3.5 rounded-xl text-xs text-gray-600">
              {activeOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between font-medium">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                <span>Total Cobrado</span>
                <span className="text-[#C0492B]">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action to make another order */}
          {activeOrder.status === 'DELIVERED' && (
            <button
              onClick={() => setTabStudent('catalog')}
              className="w-full flex items-center justify-center gap-1.5 py-3 px-4 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200"
            >
              Hacer Nuevo Pedido
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm py-16">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3.5">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-gray-900">No hay Pedido Activo</h4>
          <p className="text-[10px] text-gray-400 mt-1 mb-6 max-w-xs mx-auto leading-relaxed">
            Actualmente no tienes ningún pedido en cola de preparación. Visita el catálogo para ordenar tus alimentos.
          </p>
          <button
            onClick={() => setTabStudent('catalog')}
            className="px-6 py-2.5 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.97]"
          >
            Ver Menú de Cafetería
          </button>
        </div>
      )}

    </div>
  );
};
