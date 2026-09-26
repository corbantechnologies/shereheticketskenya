/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  Menu,
  ChevronRight,
  QrCode,
  Copy,
  ExternalLink,
  Plus,
  Compass,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface PortalHeaderProps {
  onOpenMobile: () => void;
  collapsed: boolean;
}

export default function PortalHeader({ onOpenMobile, collapsed }: PortalHeaderProps) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { data: account } = useFetchAccount();

  const companies = account?.companies || [];
  const currentCompanyRef = (params?.reference as string) || companies[0]?.reference;
  const currentEventCode = params?.event_code as string | undefined;

  const currentCompany = companies.find((c: any) => c.reference === currentCompanyRef);

  // Parse path breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [{ label: "Portal", href: "/organizer/dashboard" }];

    if (currentCompany) {
      crumbs.push({
        label: currentCompany.name,
        href: `/company/${currentCompany.reference}/events`,
      });
    }

    if (currentEventCode) {
      crumbs.push({
        label: currentEventCode,
        href: `/company/${currentCompanyRef}/events/${currentEventCode}`,
      });
    }

    if (pathname.includes("/scan")) {
      crumbs.push({ label: "Gate Scanner", href: pathname });
    } else if (pathname.includes("/create")) {
      crumbs.push({ label: "Create Event", href: pathname });
    } else if (pathname.includes("/admin/dashboard")) {
      return [
        { label: "Portal", href: "/organizer/dashboard" },
        { label: "Admin Console", href: "/admin/dashboard" },
      ];
    } else if (pathname.includes("/admin/events")) {
      return [
        { label: "Portal", href: "/organizer/dashboard" },
        { label: "Admin Events Index", href: "/admin/events" },
      ];
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href + idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                {isLast ? (
                  <span className="font-bold text-white truncate max-w-[200px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-slate-400 hover:text-white transition truncate max-w-[150px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Launchers & Navigation */}
      <div className="flex items-center gap-2.5">
        {/* Marketplace Explorer */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden lg:flex h-8 text-xs border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white gap-1.5 rounded-xl"
        >
          <Link href="/events" target="_blank">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Public Marketplace</span>
            <ExternalLink className="w-3 h-3 text-slate-500 ml-0.5" />
          </Link>
        </Button>

        {/* Quick Launch Event Scanner if on event page */}
        {currentCompanyRef && currentEventCode && (
          <Button
            size="sm"
            onClick={() =>
              router.push(`/company/${currentCompanyRef}/events/${currentEventCode}/scan`)
            }
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch Scanner</span>
          </Button>
        )}

        {/* Create Event Quick Button */}
        {currentCompanyRef && (
          <Button
            size="sm"
            onClick={() => router.push(`/company/${currentCompanyRef}/events/create`)}
            className="h-8 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold gap-1.5 rounded-xl shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Event</span>
          </Button>
        )}
      </div>
    </header>
  );
}
