// components/general/OrganizerNavbar.tsx
"use client";

import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Home,
  Calendar,
  Settings,
  BarChart3,
  Building2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface OrganizerNavbarProps {
  company: {
    name: string;
    reference: string;
    company_code: string;
    avatar: File | null;
  };
}

export default function OrganizerNavbar({ company }: OrganizerNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: `./${company.reference}` },
    { icon: Calendar, label: "Events", href: `./${company.reference}/events` },
    {
      icon: BarChart3,
      label: "Analytics",
      href: `./${company.reference}/analytics`,
    },

    {
      icon: Settings,
      label: "Settings",
      href: `./${company.reference}/settings`,
    },
    { icon: Building2, label: "Companies", href: `/organizer/dashboard` },
  ];

  const isActive = (href: string) => {
    if (href === ".")
      return (
        pathname.endsWith("/company/[reference]") || pathname.endsWith("/")
      );
    return pathname.includes(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Company */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-(--mainRed) rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {company.name[0]}
                </span>
              </div>
              <span className="ml-3 text-xl font-semibold text-(--mainBlue) hidden sm:block">
                {company.name}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 transition-colors ${
                  isActive(item.href)
                    ? "text-(--mainBlue) font-medium"
                    : "text-gray-600 hover:text-(--mainBlue)"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-(--mainRed) transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-500">Company</p>
              <p className="text-base font-medium">{company.name}</p>
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-(--mainBlue)/5 text-(--mainBlue) font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            ))}
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-md text-left transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
