/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Calendar,
  Search,
  MapPin,
  Ticket,
  QrCode,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function CompanyEventsPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const {
    isLoading,
    data: company,
    refetch: refetchCompany,
  } = useFetchCompany(reference);

  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-400">Organization not found.</p>
      </div>
    );
  }

  const events = company.company_events || [];
  const now = new Date();
  const totalEvents = events.length;
  const liveEvents = events.filter((e: any) => !e.is_closed && e.is_published).length;
  const closedEvents = events.filter((e: any) => e.is_closed).length;

  const filteredEvents = useMemo(() => {
    return events.filter((e: any) => {
      // Tab filter
      if (activeTab === "published" && (e.is_closed || !e.is_published)) return false;
      if (activeTab === "draft" && (!e.is_closed && e.is_published)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          e.name?.toLowerCase().includes(q) ||
          e.event_code?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, activeTab, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Events Hub</h1>
            <Badge className="bg-slate-800 border-slate-700 text-slate-300 text-xs">
              {company.name}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Produce, monitor, scan gate tickets, and track sales performance for your live events.
          </p>
        </div>

        <Button
          onClick={() => router.push(`/company/${reference}/events/create`)}
          className="h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Event</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Productions</p>
              <p className="text-2xl font-extrabold text-white mt-1">{totalEvents}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Under {company.name}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Live on Marketplace</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{liveEvents}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Actively selling tickets</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Closed / Past Events</p>
              <p className="text-2xl font-extrabold text-slate-300 mt-1">{closedEvents}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Archived or completed</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar: Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({totalEvents})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "published"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live ({liveEvents})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("draft")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "draft"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Closed ({closedEvents})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search event name, venue, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-950 border-slate-800 text-white rounded-xl focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event: any) => {
            const isClosed = event.is_closed;
            const isPublished = event.is_published;
            const tiers = event.ticket_types || [];

            return (
              <Card
                key={event.reference || event.event_code}
                className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Event Thumbnail */}
                  <div className="h-44 w-full bg-slate-800 relative overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-850">
                        <Calendar className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <Badge
                        className={`text-[10px] font-bold ${
                          isClosed
                            ? "bg-rose-500 text-white"
                            : isPublished
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-amber-500 text-slate-950"
                        }`}
                      >
                        {isClosed ? "CLOSED" : isPublished ? "LIVE" : "DRAFT"}
                      </Badge>
                    </div>

                    <div className="absolute bottom-2.5 left-3">
                      <Badge className="bg-slate-950/80 border border-slate-800 text-cyan-400 text-[10px] font-mono">
                        {event.event_code}
                      </Badge>
                    </div>
                  </div>

                  {/* Event Content Details */}
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-cyan-400 transition">
                      {event.name}
                    </h3>

                    <div className="text-xs text-slate-400 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          {event.start_date
                            ? format(new Date(event.start_date), "dd MMM yyyy")
                            : "Date TBA"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="line-clamp-1">{event.venue || "Venue TBA"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{tiers.length} Ticket Tiers configured</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-400 hover:text-white p-0 h-auto"
                  >
                    <Link href={`/events/${event.event_code}`} target="_blank">
                      <span>Public</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/company/${reference}/events/${event.event_code}/scan`)
                      }
                      title="Gate Scanner"
                      className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 px-2"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/company/${reference}/events/${event.event_code}`)
                      }
                      className="h-8 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-sm"
                    >
                      <span>Command Center</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-white">No matching events found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No events matching "${searchQuery}" in this view.`
              : "You haven't created any events under this filter yet."}
          </p>
          <Button
            onClick={() => router.push(`/company/${reference}/events/create`)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Event
          </Button>
        </Card>
      )}
    </div>
  );
}