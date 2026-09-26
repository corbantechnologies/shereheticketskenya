/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  ArrowLeft,
  QrCode,
  ExternalLink,
  ShieldAlert,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function AdminEventsPage() {
  const router = useRouter();
  const { isLoading, data: events = [] } = useFetchEvents();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((e: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.name?.toLowerCase().includes(q) ||
      e.event_code?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.company_name?.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/dashboard")}
            className="text-slate-400 hover:text-white p-0 h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              All Platform Events
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive index of all events published on the Sherehe marketplace.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search events, codes, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-900 border-slate-700 text-white rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event: any) => {
          const totalTiers = event.ticket_types?.length || 0;
          const isClosed = event.is_closed;
          const isPublished = event.is_published;

          return (
            <Card
              key={event.reference || event.event_code}
              className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl rounded-2xl overflow-hidden hover:border-slate-700 transition"
            >
              <div className="h-36 w-full relative bg-slate-800">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Calendar className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <Badge
                    className={`text-[10px] font-bold ${
                      isClosed
                        ? "bg-rose-500 text-white"
                        : isPublished
                        ? "bg-emerald-500 text-slate-950 font-bold"
                        : "bg-amber-500 text-slate-950 font-bold"
                    }`}
                  >
                    {isClosed ? "CLOSED" : isPublished ? "LIVE" : "DRAFT"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{event.name}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{event.event_code}</p>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {event.start_date
                        ? format(new Date(event.start_date), "dd MMM yyyy")
                        : "Date TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span className="line-clamp-1">{event.venue || "Venue TBA"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-blue-400" />
                    <span>{totalTiers} Ticket Tiers configured</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-xs text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                  >
                    <Link href={`/events/${event.event_code}`} target="_blank">
                      <span>View Public Page</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 gap-1.5"
                  >
                    <Link href={`/gate/${event.event_code}`}>
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Gate Scanner</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
