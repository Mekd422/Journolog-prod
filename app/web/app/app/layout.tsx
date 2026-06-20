"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background flex-col md:flex-row">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-primary px-5 text-white md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-md p-1.5 hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-serif text-lg tracking-wide">journolog</span>
          </div>
        </header>

        {/* Sidebar */}
        <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
