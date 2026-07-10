/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminInventory } from './components/AdminInventory';
import { AdminOrders } from './components/AdminOrders';
import { AdminReports } from './components/AdminReports';
import { AdminSettings } from './components/AdminSettings';
import { StudentCatalog } from './components/StudentCatalog';
import { StudentCart } from './components/StudentCart';
import { StudentOrderStatus } from './components/StudentOrderStatus';
import { StudentHistory } from './components/StudentHistory';
import { AnimatePresence, motion } from 'motion/react';

const ContentRenderer: React.FC = () => {
  const { role, tabAdmin, tabStudent } = useApp();

  const getPageKey = () => {
    return role === 'admin' ? `admin-${tabAdmin}` : `student-${tabStudent}`;
  };

  const renderActiveScreen = () => {
    if (role === 'admin') {
      switch (tabAdmin) {
        case 'dashboard': return <AdminDashboard />;
        case 'inventory': return <AdminInventory />;
        case 'orders': return <AdminOrders />;
        case 'reports': return <AdminReports />;
        case 'settings': return <AdminSettings />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (tabStudent) {
        case 'catalog': return <StudentCatalog />;
        case 'cart': return <StudentCart />;
        case 'status': return <StudentOrderStatus />;
        case 'history': return <StudentHistory />;
        default: return <StudentCatalog />;
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={getPageKey()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="w-full"
      >
        {renderActiveScreen()}
      </motion.div>
    </AnimatePresence>
  );
};

const MainLayout: React.FC = () => {
  const { role } = useApp();

  if (role === null) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-gray-900 font-sans flex select-none">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Right Container */}
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen relative">
        {/* Upper static header */}
        <Header />

        {/* Dynamic page content stage */}
        <main className="flex-1 p-8 overflow-y-auto">
          <ContentRenderer />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
