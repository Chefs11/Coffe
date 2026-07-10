/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Info, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, tabAdmin, tabStudent, orders, currentStudentOrder } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    if (role === 'admin') {
      switch (tabAdmin) {
        case 'dashboard': return 'Resumen de Cafetería';
        case 'inventory': return 'Gestión de Inventario';
        case 'orders': return 'Monitoreo de Pedidos Activos';
        case 'reports': return 'Análisis y Reportes';
        case 'settings': return 'Ajustes de Operación';
        default: return 'Panel de Administración';
      }
    } else {
      switch (tabStudent) {
        case 'catalog': return 'Catálogo del Campus';
        case 'cart': return 'Detalle de mi Pedido';
        case 'status': return 'Monitoreo en Tiempo Real';
        case 'history': return 'Historial de Consumo';
        default: return 'Portal Estudiantil';
      }
    }
  };

  const getSubtitle = () => {
    if (role === 'admin') {
      switch (tabAdmin) {
        case 'dashboard': return 'Métricas clave y flujo de pedidos de hoy.';
        case 'inventory': return 'Actualiza stock, precios y disponibilidad en tiempo real.';
        case 'orders': return 'Administra la cola de preparación y despacha listos.';
        case 'reports': return 'Visualiza rentabilidad, volumen de ventas y preferencias.';
        case 'settings': return 'Establece horarios comerciales e interruptores de servicio.';
        default: return '';
      }
    } else {
      switch (tabStudent) {
        case 'catalog': return 'Selecciona tus productos favoritos y haz tu pedido rápido.';
        case 'cart': return 'Revisa tus productos seleccionados antes de confirmar.';
        case 'status': return 'Revisa tu número de turno y la fila virtual de recogida.';
        case 'history': return 'Listado completo de tus transacciones y consumos previos.';
        default: return '';
      }
    }
  };

  // Generate dynamic mock notifications based on order status
  const getNotifications = () => {
    const list = [];
    if (role === 'student') {
      if (currentStudentOrder) {
        if (currentStudentOrder.status === 'PREPARING') {
          list.push({
            id: 'n1',
            text: `Tu pedido ${currentStudentOrder.id} se encuentra en preparación.`,
            type: 'info',
            time: 'Hace un momento'
          });
        } else if (currentStudentOrder.status === 'READY') {
          list.push({
            id: 'n1',
            text: `¡Tu pedido ${currentStudentOrder.id} está LISTO para recoger! Acércate a barra.`,
            type: 'success',
            time: 'Hace un momento'
          });
        }
      }
      list.push({
        id: 'n2',
        text: '¡Nueva Ensalada César Fresh con 10% de descuento hoy!',
        type: 'promo',
        time: 'Hace 2 horas'
      });
    } else {
      // Admin notifications
      const activePreps = orders.filter(o => o.status === 'PREPARING').length;
      if (activePreps > 0) {
        list.push({
          id: 'na1',
          text: `Tienes ${activePreps} pedidos en cola de preparación.`,
          type: 'info',
          time: 'En tiempo real'
        });
      }
      list.push({
        id: 'na2',
        text: 'Alerta: El stock de Pizza Pepperoni Lover ha llegado a 0.',
        type: 'alert',
        time: 'Hace 1 hora'
      });
    }
    return list;
  };

  const notifications = getNotifications();

  return (
    <header className="h-[76px] bg-white border-b border-gray-100 flex items-center justify-between px-8 select-none font-sans relative z-20">
      
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-base font-bold text-gray-900 leading-tight">
          {getTitle()}
        </h1>
        <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">
          {getSubtitle()}
        </p>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-6">
        
        {/* Search Bar - Mock Interactive */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-60 pl-10 pr-4 py-2 bg-[#F3F4F6]/60 border border-gray-100 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-[#F3F4F6] focus:border-gray-200 transition-all"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-gray-50 rounded-xl border border-gray-100 text-gray-500 hover:text-gray-900 transition-all relative active:scale-95"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C0492B]" />
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div 
              id="notifications-dropdown"
              className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 py-1"
            >
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900">Notificaciones</h3>
                <span className="text-[9px] font-bold text-[#C0492B] uppercase bg-[#C0492B]/10 px-2 py-0.5 rounded-full">
                  {notifications.length} Nuevas
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50/50 flex gap-3 transition-colors">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4.5 h-4.5 text-[#C0492B] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs text-gray-800 font-medium leading-normal">{n.text}</p>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 text-center bg-gray-50">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-bold text-gray-500 hover:text-gray-900"
                >
                  Cerrar panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Small Status Indicator - Anti AI Slop Literal label */}
        <div className="flex items-center gap-2 text-xs border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Sistema Activo</span>
        </div>

      </div>
    </header>
  );
};
