/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Download, ArrowUpRight, DollarSign, Award, Calendar, Check } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { orders, products } = useApp();
  const [exportSuccess, setExportSuccess] = useState(false);

  // 1. Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Find top product sold by summing up product quantities in all orders
  const productSalesMap: { [key: string]: { name: string; qty: number; totalRev: number; category: string } } = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        // find category in current products
        const prod = products.find(p => p.id === item.productId);
        productSalesMap[item.productId] = {
          name: item.name,
          qty: 0,
          totalRev: 0,
          category: prod ? prod.category : 'General'
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].totalRev += item.price * item.quantity;
    });
  });

  const sortedSales = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);
  const topProduct = sortedSales[0] || { name: 'N/A', qty: 0 };

  // 2. Weekly sales chart data (last 5 days)
  const weeklySales = [
    { day: 'Lun', sales: 420 },
    { day: 'Mar', sales: 510 },
    { day: 'Mie', sales: 380 },
    { day: 'Jue', sales: 630 },
    { day: 'Vie', sales: 740 }
  ];

  const maxVal = Math.max(...weeklySales.map(w => w.sales)) * 1.15;
  const chartHeight = 150;
  const chartWidth = 460;
  const padding = 25;

  // 3. Export CSV utility
  const handleExportCSV = () => {
    // Generate actual CSV content in Spanish
    let csvContent = 'ID Pedido,Cliente,Turno,Hora,Total,Estado,Productos\n';
    orders.forEach(o => {
      const itemsString = o.items.map(i => `${i.quantity}x ${i.name}`).join(' | ');
      csvContent += `${o.id},"${o.customerName}",${o.turnNumber},${o.createdAt},${o.total.toFixed(2)},${o.status},"${itemsString}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `informe_ventas_express_bite_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show temporary success feedback
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Volumen Acumulado</span>
            <h4 className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h4>
            <p className="text-[10px] text-green-600 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs semana anterior
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#C0492B]/5 text-[#C0492B] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ticket Promedio</span>
            <h4 className="text-2xl font-bold text-gray-900">${averageTicket.toFixed(2)}</h4>
            <p className="text-[10px] text-gray-500">Por transacción de hoy</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Ventas</span>
            <h4 className="text-lg font-bold text-gray-900 truncate max-w-[170px]">{topProduct.name}</h4>
            <p className="text-[10px] text-gray-500">{topProduct.qty} unidades vendidas</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Graphs and Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly sales SVG Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Histórico Semanal ($)</h4>
              <p className="text-[10px] text-gray-500">Ingresos consolidados de lunes a viernes.</p>
            </div>
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Última Semana
            </span>
          </div>

          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center justify-center">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
              {/* Grid Lines */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#E5E7EB" strokeWidth="1" />
              <line x1={padding} y1={(chartHeight - padding) / 2 + padding / 2} x2={chartWidth - padding} y2={(chartHeight - padding) / 2 + padding / 2} stroke="#F3F4F6" strokeWidth="0.75" strokeDasharray="3" />

              {/* Bar Columns */}
              {weeklySales.map((w, idx) => {
                const colWidth = 32;
                const colSpacing = (chartWidth - padding * 2) / weeklySales.length;
                const x = padding + idx * colSpacing + (colSpacing - colWidth) / 2;
                const barHeight = ((w.sales * (chartHeight - padding * 2)) / maxVal);
                const y = chartHeight - padding - barHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    {/* Tooltip on top of bar */}
                    <rect 
                      x={x - 6} 
                      y={y - 22} 
                      width={colWidth + 12} 
                      height="16" 
                      rx="3" 
                      fill="#1F2937" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    />
                    <text 
                      x={x + colWidth / 2} 
                      y={y - 11} 
                      fill="#FFFFFF" 
                      fontSize="8" 
                      fontWeight="bold" 
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      ${w.sales}
                    </text>

                    {/* Styled rounded bar */}
                    <rect
                      x={x}
                      y={y}
                      width={colWidth}
                      height={barHeight}
                      rx="4"
                      fill="#C0492B"
                      className="opacity-90 hover:opacity-100 transition-opacity duration-150"
                    />

                    {/* Day text */}
                    <text
                      x={x + colWidth / 2}
                      y={chartHeight - 8}
                      fill="#9CA3AF"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {w.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Ranking List */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Ranking de Demanda</h4>
            <p className="text-[10px] text-gray-500">Los artículos más elegidos por los estudiantes hoy.</p>
          </div>

          <div className="space-y-4 flex-1 mt-4">
            {sortedSales.length > 0 ? (
              sortedSales.slice(0, 3).map((item, idx) => {
                const percentage = Math.min(100, Math.round((item.qty / sortedSales[0].qty) * 100));
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-gray-100 text-gray-600 font-bold text-[10px] flex items-center justify-center border border-gray-200">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <span className="text-[9px] font-bold text-[#C0492B] uppercase bg-[#C0492B]/5 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">{item.qty} uds</span>
                    </div>

                    {/* Custom progress bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C0492B] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <BarChart3 className="w-7 h-7 text-gray-300 mb-1.5" />
                <p className="text-[10px] font-bold text-gray-600">Aún no hay transacciones para clasificar</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Historical Logs and CSV Export */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Libro Contable de Ventas</h4>
            <p className="text-[10px] text-gray-500">Historial completo para fiscalización o auditoría.</p>
          </div>
          
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 ${
              exportSuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            {exportSuccess ? (
              <>
                <Check className="w-4 h-4" />
                ¡Archivo CSV Descargado!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-gray-400" />
                Exportar Historial (.CSV)
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Id Pedido</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Cliente</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Turno</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Hora</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">{o.id}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-700">{o.customerName}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#C0492B]">#{o.turnNumber}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{o.createdAt}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">${o.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                      o.status === 'DELIVERED' 
                        ? 'bg-gray-50 text-gray-500 border-gray-200' 
                        : o.status === 'READY' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {o.status === 'DELIVERED' ? 'Entregado' : o.status === 'READY' ? 'Listo' : 'En preparación'}
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
