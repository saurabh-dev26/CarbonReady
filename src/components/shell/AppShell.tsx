"use client";

import { useState } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { TopComplianceBar } from "./TopComplianceBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen text-on-surface">
      {/* Desktop Persistent Left Rail */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-surface-container-low shadow-xl">
            <SidebarNavigation onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Persistent Top Header */}
      <TopComplianceBar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Dynamic Viewport */}
      <div className="lg:pl-72 pt-16 min-h-screen flex flex-col">
        <main className="flex-1 p-space-md lg:p-space-lg w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

