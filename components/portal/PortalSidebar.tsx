/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import CompanySwitcher from "./CompanySwitcher";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Settings,
  Ticket,
  QrCode,
  Users,
  Tag,
  DollarSign,
  ShieldAlert,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Building2,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PortalSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function PortalSidebar({
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const { data: account } = useFetchAccount();

  const companies = account?.companies || [];
  const currentCompanyRef = (params?.reference as string) || companies[0]?.reference;
  const currentEventCode = params?.event_code as string | undefined;

  const isSuperUser = account?.is_superuser || account?.is_staff;
  const isPremium = account?.is_premium;

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  const navItemClass = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    } ${collapsed ? "justify-center px-2" : ""}`;
  };

  const subNavItemClass = (hashOrTab: string) => {
    return `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition`;
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-200 shadow-xs ${
        collapsed ? "w-20" : "w-64"
      } ${
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        <Link
          href="/organizer/dashboard"
          onClick={closeMobile}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm shrink-0">
            S
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">
                Sherehe<span className="text-blue-600">Portal</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                Pro Organizer
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Multi-Company Selector */}
      <CompanySwitcher collapsed={collapsed} />

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {/* Workspace Hub */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
          )}

          <Link
            href="/organizer/dashboard"
            onClick={closeMobile}
            className={navItemClass("/organizer/dashboard", true)}
            title="Organizer Portal Hub"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Portal Hub</span>}
          </Link>
        </div>

        {/* Company Module Navigation */}
        {currentCompanyRef && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Organization
              </p>
            )}

            <Link
              href={`/company/${currentCompanyRef}/events`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/events`, true)}
              title="Events Hub"
            >
              <Calendar className="w-4 h-4 shrink-0 text-blue-600" />
              {!collapsed && <span>Events Hub</span>}
            </Link>

            <Link
              href={`/company/${currentCompanyRef}/tickets`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/tickets`, true)}
              title="Tickets & Attendees Hub"
            >
              <Ticket className="w-4 h-4 shrink-0 text-purple-600" />
              {!collapsed && <span>Tickets &amp; Passes</span>}
            </Link>

            <Link
              href={`/company/${currentCompanyRef}/scan`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/scan`, true)}
              title="Gate Check-in & Scanner Module"
            >
              <QrCode className="w-4 h-4 shrink-0 text-emerald-600" />
              {!collapsed && <span>Gate Check-in</span>}
            </Link>

            <Link
              href={`/company/${currentCompanyRef}/events/create`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/events/create`, true)}
              title="Create New Event"
            >
              <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />
              {!collapsed && <span className="font-semibold text-blue-600">Create Event</span>}
            </Link>

            <Link
              href={`/company/${currentCompanyRef}`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}`, true)}
              title="Organization Settings & Brand Profile"
            >
              <Building2 className="w-4 h-4 shrink-0 text-slate-500" />
              {!collapsed && <span>Brand Profile</span>}
            </Link>
          </div>
        )}

        {/* Contextual Active Event Sub-Menu */}
        {currentCompanyRef && currentEventCode && (
          <div className="space-y-1 pt-2 border-t border-slate-200">
            {!collapsed && (
              <div className="px-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Active Event
                </span>
                <span className="font-mono text-[10px] text-slate-400">{currentEventCode}</span>
              </div>
            )}

            <Link
              href={`/company/${currentCompanyRef}/events/${currentEventCode}`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/events/${currentEventCode}`, true)}
              title="Event Command Center"
            >
              <Layers className="w-4 h-4 shrink-0 text-emerald-600" />
              {!collapsed && <span>Command Center</span>}
            </Link>

            <Link
              href={`/company/${currentCompanyRef}/events/${currentEventCode}/scan`}
              onClick={closeMobile}
              className={navItemClass(`/company/${currentCompanyRef}/events/${currentEventCode}/scan`, true)}
              title="Gate Scanner Console"
            >
              <QrCode className="w-4 h-4 shrink-0 text-amber-600" />
              {!collapsed && <span>Live Scanner</span>}
            </Link>
          </div>
        )}

        {/* Superadmin Console (Staff Only) */}
        {isSuperUser && (
          <div className="space-y-1 pt-2 border-t border-slate-200">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Superadmin
              </p>
            )}

            <Link
              href="/admin/dashboard"
              onClick={closeMobile}
              className={navItemClass("/admin/dashboard", true)}
              title="Platform Admin Dashboard"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              {!collapsed && <span>Admin Console</span>}
            </Link>

            <Link
              href="/admin/events"
              onClick={closeMobile}
              className={navItemClass("/admin/events", true)}
              title="Global Marketplace Events"
            >
              <Globe className="w-4 h-4 shrink-0 text-slate-500" />
              {!collapsed && <span>All Events Index</span>}
            </Link>
          </div>
        )}
      </div>

      {/* User Profile & Sign Out Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 shrink-0">
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-100 shrink-0">
            <AvatarImage src={account?.avatar || undefined} />
            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold rounded-xl">
              {account?.first_name?.[0]}
              {account?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {account?.first_name} {account?.last_name}
                </p>
                <Badge
                  className={`text-[9px] px-1.5 py-0 font-bold ${
                    isPremium
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isPremium ? "PRO" : "FREE"}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{account?.email}</p>
            </div>
          )}

          {!collapsed && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
              title="Sign out of portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
