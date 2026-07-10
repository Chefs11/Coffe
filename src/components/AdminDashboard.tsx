/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Flame, 
  ChevronRight 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { orders, products, setTabAdmin, updateOrderStatus } = useApp();
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  // 1. Calculations for metrics
  const activeOrdersCount = orders.filter(o => o.status === 'PREPARING' || o.status === 'READY').length;
  const totalOrdersToday = orders.length;
  const revenueToday = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  // 2. Sales by hour data (Mocked dynamic SVG chart points)
  const salesByHour = [
    { hour: '08:00', total: 120 },
    { hour: '10:00', total: 240 },
    { hour: '12:00', total: 480 }, // Lunch peak
    { hour: '14:00', total: 310 },
    { hour: '16:00', total: 180 },
    { hour: '18:00', total: 290 }, // Dinner peak
    { hour: '20:00', total: 90 }
  ];

  // SVG Chart Calculations
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;
  const maxVal = Math.max(...salesByHour.map(s => s.total)) * 1.15;

  const points = salesByHour.map((s, idx) => {
    const x = padding + (idx * (chartWidth - padding * 2)) / (salesByHour.length - 1);
    const y = chartHeight - padding - (s.total * (chartHeight - padding * 2)) / maxVal;
    return { x, y, ...s };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill area under line
  const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

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
    <div className="space-y-6 font-sans">
      
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Pedidos Activos */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pedidos Activos</span>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">{activeOrdersCount}</h3>
            <p className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              En cocina o listos
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Pedidos Hoy */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pedidos Hoy</span>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">{totalOrdersToday}</h3>
            <p className="text-[10px] font-medium text-gray-500">Volumen acumulado</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Ingresos Hoy */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingresos Despachados</span>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">${revenueToday.toFixed(2)}</h3>
            <p className="text-[10px] font-medium text-[#C0492B] flex items-center gap-0.5">
              Corte de caja neto
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#C0492B]/5 border border-[#C0492B]/10 flex items-center justify-center text-[#C0492B]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Bajo Stock */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bajo Stock / Agotados</span>
            <h3 className="text-2xl font-bold text-gray-900 leading-none">{lowStockCount}</h3>
            <p className="text-[10px] font-medium text-red-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Requiere atención
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 2. Chart and Recent Activity Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales by Hour Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Curva de Ventas por Hora</h4>
              <p className="text-[10px] text-gray-500">Muestra los picos de afluencia estudiantil en el día.</p>
            </div>
            <span className="text-[10px] font-bold text-[#C0492B] bg-[#C0492B]/5 border border-[#C0492B]/10 px-2 py-1 rounded-lg">
              Hoy • Tiempo Real
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full overflow-hidden flex justify-center py-2 bg-gray-50/50 rounded-xl border border-gray-100">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full max-w-[550px] overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C0492B" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#C0492B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
              <line x1={padding} y1={(chartHeight) / 2} x2={chartWidth - padding} y2={(chartHeight) / 2} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#D1D5DB" strokeWidth="1" />

              {/* Gradient Area */}
              <path d={fillD} fill="url(#chartGradient)" />

              {/* Trend Line */}
              <path d={pathD} fill="none" stroke="#C0492B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Interaction Points */}
              {points.map((p, idx) => (
                <g 
                  key={idx} 
                  onMouseEnter={() => setHoveredHour(idx)}
                  onMouseLeave={() => setHoveredHour(null)}
                  className="cursor-pointer"
                >
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredHour === idx ? 6 : 4} 
                    fill={hoveredHour === idx ? '#C0492B' : '#FFFFFF'} 
                    stroke="#C0492B" 
                    strokeWidth="2.5" 
                    className="transition-all duration-150"
                  />
                  {/* Tooltip text when hovered */}
                  {hoveredHour === idx && (
                    <g>
                      <rect 
                        x={p.x - 35} 
                        y={p.y - 30} 
                        width="70" 
                        height="20" 
                        rx="4" 
                        fill="#1F2937" 
                      />
                      <text 
                        x={p.x} 
                        y={p.y - 17} 
                        fill="#FFFFFF" 
                        fontSize="9" 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        ${p.total}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, idx) => (
                <text 
                  key={idx} 
                  x={p.x} 
                  y={chartHeight - 10} 
                  fill="#9CA3AF" 
                  fontSize="8.5" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {p.hour}
                </text>
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-[10px] text-gray-500 font-medium">
            <span>Hora de apertura: 07:30</span>
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-[#C0492B]" /> Hora pico: 12:00 - 13:00</span>
          </div>
        </div>

        {/* Live Orders Queue Status summary */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Fila Virtual Activa</h4>
            <p className="text-[10px] text-gray-500 mb-4">Pedidos pendientes de despacho inmediato.</p>
          </div>

          <div className="space-y-3.5 flex-1">
            {orders.filter(o => o.status !== 'DELIVERED').slice(0, 3).length > 0 ? (
              orders.filter(o => o.status !== 'DELIVERED').slice(0, 3).map((o, idx) => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-900">#{o.turnNumber}</span>
                      <span className="text-[10px] font-medium text-gray-500">({o.customerName})</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 truncate max-w-[140px]">
                      {o.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusColor(o.status)}`}>
                    {getStatusLabel(o.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle className="w-7 h-7 text-green-500 mb-1.5" />
                <p className="text-[10px] font-bold text-gray-700">¡Todo al día!</p>
                <p className="text-[9px] text-gray-400">No hay pedidos en cola actualmente.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setTabAdmin('orders')}
            className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#C0492B] hover:text-[#A3381F] bg-[#C0492B]/5 hover:bg-[#C0492B]/10 py-2.5 rounded-xl transition-all mt-4"
          >
            Ver Monitor de Cocina
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3. Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Flujo General de Pedidos</h4>
            <p className="text-[10px] text-gray-500">Últimas transacciones registradas en el sistema.</p>
          </div>
          <button 
            onClick={() => setTabAdmin('orders')}
            className="text-[10px] font-bold text-[#C0492B] hover:underline flex items-center gap-0.5"
          >
            Administrar todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Pedido</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Cliente</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Turno</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Hora</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Detalle</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{o.id}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">{o.customerName}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#C0492B]">#{o.turnNumber}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{o.createdAt}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600 max-w-xs truncate" title={o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
                    {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">${o.total.toFixed(2)}</td>
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

    </div>
  );
};
