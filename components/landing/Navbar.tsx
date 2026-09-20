"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sparkles,
  Search,
  Calendar,
  Ticket,
  PlusCircle,
  LogIn,
  User,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Discover Events", href: "/events", icon: Compass },
    { name: "Host an Event", href: "/organizers", icon: PlusCircle },
    { name: "About Us", href: "/about", icon: Sparkles },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5"
          : "bg-slate-950/60 backdrop-blur-md border-b border-slate-800/40 py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-rose-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Sherehe<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400">Tickets</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5 text-blue-400" />
              <span>Sign In</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-500/25 rounded-xl px-4 h-9"
          >
            <Link href="/organizers" className="flex items-center gap-1.5">
              <span>Create Event</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-6 space-y-5 shadow-2xl animate-in slide-in-from-top-3">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                >
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Button
              asChild
              variant="outline"
              className="w-full justify-center border-slate-700 bg-slate-900 text-slate-200 rounded-xl"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="w-full justify-center bg-gradient-to-r from-blue-600 to-rose-600 text-white font-bold rounded-xl shadow-lg"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/organizers">Create Event</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
