import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNavigation } from './AdminTopNavigation';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans text-text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface border-r border-surface-border z-50 md:hidden flex flex-col"
            >
              <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <AdminTopNavigation onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
