"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Compass,
  ImageIcon,
  LogOut,
  Map,
  Settings,
  Tags,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/app/logs", label: "Journey Logs", icon: BookOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/app/entries", label: "Entries", icon: BookOpen },
  { href: "/app/media", label: "Media", icon: ImageIcon },
  { href: "/app/map", label: "Map", icon: Map },
  { href: "/app/tags", label: "Tags", icon: Tags },
  { href: "/app/settings", label: "Journal Settings", icon: Settings },
];

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary text-white transition-transform duration-300 ease-in-out md:relative md:flex md:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 hover:opacity-90"
          >
            <Compass className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <span className="font-serif text-lg tracking-wide">journolog</span>
          </Link>
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-5" onClick={onClose}>
          <Link href="/app/logs/new">
            <Button className="w-full justify-center">+ New Journey Log</Button>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-black/20 text-white"
                    : "text-white/80 hover:bg-black/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 flex items-center gap-3 rounded-[4px] px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>
              <p className="truncate text-xs text-white/60">{user?.email}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-white/60" />
          </div>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="flex items-center gap-2 px-2 text-sm text-white/70 transition hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
