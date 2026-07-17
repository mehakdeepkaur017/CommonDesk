import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopToolbar } from "./TopToolbar";
import { CommandPalette } from "../../../features/search/CommandPalette";

export const DashboardLayout = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex print:bg-white print:block">
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col md:ml-64 print:ml-0 print:block">
        <div className="print:hidden">
          <TopToolbar />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface pb-12 relative print:overflow-visible print:bg-white">
          {/* Subtle background noise texture */}
          <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-soft-light z-0" />
          
          <div className="relative z-10 p-4 sm:p-8 w-full max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
