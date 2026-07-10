/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coffee, 
  LayoutDashboard, 
  Package, 
  Clock, 
  BarChart3, 
  Settings, 
  Utensils, 
  ShoppingCart, 
  History, 
  LogOut, 
  User 
} from 'lucide-react';
import { ActiveTabAdmin, ActiveTabStudent } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    role, 
    setRole, 
    tabAdmin, 
    setTabAdmin, 
    tabStudent, 
    setTabStudent, 
    cart,
    currentStudentOrder
  } = useApp();

  const studentName = localStorage.getItem('eb_student_name') || 'Mateo García';
  const adminName = localStorage.getItem('eb_admin_name') || 'Administrador Central';

  const handleLogout = () => {
    setRole(null);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'orders', label: 'Pedidos Activos', icon: Clock, badge: null }, // we can count active orders (PREPARING + READY)
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const studentMenu = [
    { id: 'catalog', label: 'Catálogo', icon: Utensils },
    { id: 'cart', label: 'Mi Pedido', icon: ShoppingCart, count: totalCartItems },
    { id: 'status', label: 'Estado del Pedido', icon: Clock, highlight: !!currentStudentOrder },
    { id: 'history', label: 'Historial', icon: History },
  ];

  return (
    <aside id="sidebar-container" className="fixed top-0 left-0 w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between select-none z-30 font-sans">
      
      {/* Brand Section */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C0492B] text-white">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">Express-Bite</h2>
            <span className="text-[10px] font-bold text-[#C0492B] uppercase tracking-wider">University</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {role === 'admin' ? (
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Panel Admin</p>
            {adminMenu.map(item => {
              const isActive = tabAdmin === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-admin-${item.id}`}
                  onClick={() => setTabAdmin(item.id as ActiveTabAdmin)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive 
                      ? 'bg-[#C0492B] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Portal Estudiante</p>
            {studentMenu.map(item => {
              const isActive = tabStudent === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-student-${item.id}`}
                  onClick={() => setTabStudent(item.id as ActiveTabStudent)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive 
                      ? 'bg-[#C0492B] text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'} ${item.highlight && !isActive ? 'animate-pulse text-[#C0492B]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Optional Badges */}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                      isActive ? 'bg-white text-[#C0492B]' : 'bg-[#C0492B] text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#C0492B] animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* User Information & Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase border border-gray-200">
              {role === 'admin' ? 'AD' : studentName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-gray-900 truncate max-w-[110px]" title={role === 'admin' ? adminName : studentName}>
                {role === 'admin' ? adminName : studentName}
              </h4>
              <p className="text-[10px] text-[#6B7280] font-medium leading-none mt-0.5">
                {role === 'admin' ? 'Administrador' : 'Estudiante'}
              </p>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
