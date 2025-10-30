'use client';

import React from 'react';
import Sidebar from '@/components/msidebar/MSidebar';
import Header from '@/components/header/Header';

export default function MasterLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}