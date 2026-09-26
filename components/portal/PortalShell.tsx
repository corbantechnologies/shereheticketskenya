"use client";

import React, { useState, useEffect } from "react";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore sidebar state preference
  useEffect(() => {
    const saved = localStorage.getItem("sherehe_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem("sherehe_sidebar_collapsed", String(val));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-white">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Persistent Sidebar */}
      <PortalSidebar
        collapsed={collapsed}
        setCollapsed={handleToggleCollapse}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <PortalHeader
          onOpenMobile={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
