/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { setRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, ingresa tu usuario o código universitario.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor, ingresa tu contraseña.');
      return;
    }

    // Save mock name for student
    if (selectedRole === 'student') {
      localStorage.setItem('eb_student_name', username);
    } else {
      localStorage.setItem('eb_admin_name', username);
    }
    
    setError('');
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center items-center px-4 py-12 select-none font-sans">
      {/* Container holding logo and centered card */}
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C0492B] text-white shadow-md mb-3">
            <Coffee className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Express-Bite <span className="font-light text-gray-500">University</span>
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Sistema Inteligente de Gestión de Cafetería
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F3F4F6] rounded-xl mb-6">
            <button
              type="button"
              id="role-student-btn"
              onClick={() => {
                setSelectedRole('student');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold rounded-lg transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-[#C0492B]' : 'text-gray-400'}`} />
              Estudiante
            </button>
            
            <button
              type="button"
              id="role-admin-btn"
              onClick={() => {
                setSelectedRole('admin');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold rounded-lg transition-all duration-200 ${
                selectedRole === 'admin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#C0492B]' : 'text-gray-400'}`} />
              Administrador
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                {selectedRole === 'student' ? 'Código Estudiantil o Nombre' : 'Usuario Administrador'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={selectedRole === 'student' ? 'ej. Mateo García o U20210042' : 'ej. admin_central'}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0492B]/20 focus:border-[#C0492B] transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0492B]/20 focus:border-[#C0492B] transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-[#DC2626] font-medium mt-1">
                {error}
              </p>
            )}

            {/* Quick Helper Credentials */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-[11px] text-[#6B7280]">
              <span className="font-semibold text-gray-700">Acceso Libre:</span> Ingresa cualquier credencial para iniciar el simulador.
            </div>

            {/* Login Button */}
            <button
              type="submit"
              id="login-submit-btn"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#C0492B] hover:bg-[#A3381F] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              Iniciar Sesión
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-[#6B7280] mt-8">
          Express-Bite University v1.0 • Hecho para el Campus de Excelencia
        </p>
      </div>
    </div>
  );
};
