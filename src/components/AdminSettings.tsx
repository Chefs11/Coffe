/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ToggleLeft, ToggleRight, Building, Users, Sliders, Check } from 'lucide-react';

type SettingsTab = 'schedule' | 'business' | 'staff' | 'prefs';

export const AdminSettings: React.FC = () => {
  const { schedule, updateSchedule } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('schedule');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Business info form state
  const [cafeteriaName, setCafeteriaName] = useState('Express-Bite Central');
  const [address, setAddress] = useState('Edificio Central de Bienestar Estudiantil, Campus Norte');
  const [serviceFee, setServiceFee] = useState('0.50');
  const [taxRate, setTaxRate] = useState('0.0');

  // Staff listing
  const staffMembers = [
    { name: 'Diana Valenzuela', role: 'Administradora de Cafetería', email: 'diana.v@university.edu', status: 'Activo' },
    { name: 'Carlos Mendoza', role: 'Chef Ejecutivo Central', email: 'carlos.m@university.edu', status: 'Activo' },
    { name: 'Laura Restrepo', role: 'Asistente de Cocina', email: 'laura.r@university.edu', status: 'Activo' },
    { name: 'Andrés Pastrana', role: 'Cajero / Despachador', email: 'andres.p@university.edu', status: 'Activo' }
  ];

  // Preference switches
  const [soundCues, setSoundCues] = useState(true);
  const [autoReceipt, setAutoReceipt] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  const handleToggleDay = (dayIndex: number) => {
    const updated = [...schedule];
    updated[dayIndex] = { ...updated[dayIndex], isOpen: !updated[dayIndex].isOpen };
    updateSchedule(updated);
  };

  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', val: string) => {
    const updated = [...schedule];
    updated[dayIndex] = { ...updated[dayIndex], [field]: val };
    updateSchedule(updated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[550px] font-sans">
      
      {/* 1. Left Tabs Menu */}
      <div className="w-full md:w-56 border-r border-gray-100 bg-gray-50/50 p-4 space-y-1 shrink-0 flex md:flex-col">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'schedule'
              ? 'bg-white text-gray-900 border border-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#C0492B]" />
          Horarios de Atención
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'business'
              ? 'bg-white text-gray-900 border border-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4 text-[#C0492B]" />
          Datos de Negocio
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'staff'
              ? 'bg-white text-gray-900 border border-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 text-[#C0492B]" />
          Personal y Caja
        </button>

        <button
          onClick={() => setActiveTab('prefs')}
          className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'prefs'
              ? 'bg-white text-gray-900 border border-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#C0492B]" />
          Preferencias
        </button>
      </div>

      {/* 2. Content Form View Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSaveSettings} className="h-full flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* HORARIOS TAB */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Horarios de Apertura</h4>
                  <p className="text-[10px] text-gray-500">Configura qué días opera la cafetería y los horarios de retiro de pedidos.</p>
                </div>

                <div className="space-y-2 border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden bg-white">
                  {schedule.map((sch, idx) => (
                    <div key={sch.day} className="flex items-center justify-between p-3.5 hover:bg-gray-50/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {/* Custom switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleDay(idx)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {sch.isOpen ? (
                            <ToggleRight className="w-9 h-9 text-[#C0492B]" />
                          ) : (
                            <ToggleLeft className="w-9 h-9 text-gray-300" />
                          )}
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-20">{sch.day}</span>
                      </div>

                      {sch.isOpen ? (
                        <div className="flex items-center gap-2 text-xs">
                          <input
                            type="time"
                            value={sch.openTime}
                            onChange={e => handleTimeChange(idx, 'openTime', e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-lg p-1.5 font-semibold text-gray-700"
                          />
                          <span className="text-gray-400 text-[10px] font-bold">a</span>
                          <input
                            type="time"
                            value={sch.closeTime}
                            onChange={e => handleTimeChange(idx, 'closeTime', e.target.value)}
                            className="bg-gray-50 border border-gray-100 rounded-lg p-1.5 font-semibold text-gray-700"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                          Cerrado / No Operativo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEGOCIO TAB */}
            {activeTab === 'business' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Parámetros Financieros y de Negocio</h4>
                  <p className="text-[10px] text-gray-500">Modifica cargos adicionales de servicio y datos de la sucursal.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nombre Comercial de Cafetería</label>
                    <input
                      type="text"
                      value={cafeteriaName}
                      onChange={e => setCafeteriaName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Ubicación / Dirección en Campus</label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Cargo por Servicio de Barra ($)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={serviceFee}
                      onChange={e => setServiceFee(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Porcentaje de Impuesto (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={e => setTaxRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PERSONAL TAB */}
            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Personal Autorizado</h4>
                  <p className="text-[10px] text-gray-500">Lista de usuarios del campus con credenciales de despacho.</p>
                </div>

                <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden bg-white">
                  {staffMembers.map(st => (
                    <div key={st.email} className="p-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{st.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{st.email}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-600 block">{st.role}</span>
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-[9px] font-bold mt-1">
                          {st.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREFERENCIAS TAB */}
            {activeTab === 'prefs' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Preferencias de Operación</h4>
                  <p className="text-[10px] text-gray-500">Configure avisos de terminal e impresión de comprobantes.</p>
                </div>

                <div className="space-y-3.5 bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Alertas Sonoras</span>
                      <span className="text-[10px] text-gray-400">Sonido al ingresar nuevos pedidos a cocina.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundCues(!soundCues)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {soundCues ? (
                        <ToggleRight className="w-9 h-9 text-[#C0492B]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Impresión Automática</span>
                      <span className="text-[10px] text-gray-400">Genera ticket físico al marcar "Listo para recoger".</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoReceipt(!autoReceipt)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {autoReceipt ? (
                        <ToggleRight className="w-9 h-9 text-[#C0492B]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Avisos de Stock Crítico</span>
                      <span className="text-[10px] text-gray-400">Notifica cuando queden menos de 5 unidades de un ingrediente.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLowStockAlerts(!lowStockAlerts)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {lowStockAlerts ? (
                        <ToggleRight className="w-9 h-9 text-[#C0492B]" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Settings Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4 bg-white">
            <span className="text-[10px] font-bold text-[#C0492B] uppercase">Seguridad SSL Activa</span>
            
            <button
              type="submit"
              id="save-settings-btn"
              className={`flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 ${
                saveFeedback 
                  ? 'bg-green-600 text-white' 
                  : 'bg-[#C0492B] hover:bg-[#A3381F] text-white'
              }`}
            >
              {saveFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  Cambios Guardados
                </>
              ) : (
                'Guardar Ajustes'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
