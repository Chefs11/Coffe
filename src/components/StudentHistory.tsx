/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { History, Receipt } from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const { orders } = useApp();
  const loggedName = localStorage.getItem('eb_student_name') || 'Mateo García';

  // Filter historical orders belonging to the logged in student name
  const studentOrders = orders.filter(
    o => o.customerName.toLowerCase().trim() === loggedName.toLowerCase().trim()
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PREPARING': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'READY': return 'bg-green-50 text-green-700 border-green-100';
      case 'DELIVERED': return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'PREPARING': return 'En preparación';
      case 'READY': return 'Listo';
      case 'DELIVERED': return 'Entregado';
    }
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header and details */}
      <div>
        <h3 className="text-xs font-bold text-gray-900">Historial Estudiantil de Consumo</h3>
        <p className="text-[10px] text-gray-500">Consulta tus transacciones de alimentos previas y estados de facturación.</p>
      </div>

      {studentOrders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100">
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">ID Orden</th>
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Alimentos Adquiridos</th>
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Turno</th>
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Hora Compra</th>
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Monto Total</th>
                  <th className="px-6 py-4 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Estado de Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">{o.id}</td>

                    {/* Order items stringified */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-600 max-w-sm truncate" title={o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>

                    {/* Turn Number */}
                    <td className="px-6 py-4 text-xs font-bold text-[#C0492B]">#{o.turnNumber}</td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">{o.createdAt}</td>

                    {/* Total spent */}
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">${o.total.toFixed(2)}</td>

                    {/* Delivery state indicator pill */}
                    <td className="px-6 py-4 text-xs">
                      <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusColor(o.status)}`}>
                        {getStatusLabel(o.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-100 rounded-2xl p-8 max-w-md mx-auto">
          <Receipt className="w-10 h-10 text-gray-300 mb-2.5" />
          <p className="text-xs font-semibold text-gray-600">Sin historial registrado</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Aún no has finalizado pedidos con el nombre "{loggedName}".</p>
        </div>
      )}

    </div>
  );
};
