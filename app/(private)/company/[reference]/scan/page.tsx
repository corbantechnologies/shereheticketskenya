/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Calendar,
  MapPin,
  Users,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  KeyRound,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Link from "next/link";

export default function CompanyScanHubPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);
  const [searchQuery, setSearchQuery] = useState("");

  const events = company?.company_events || [];

  const filteredEvents = events.filter((e: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.name?.toLowerCase().includes(q) ||
      e.event_code?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
    );
  });

  const copyPIN = (pin: string, eventName: string) => {
    navigator.clipboard.writeText(pin);
    toast.success(`Gate PIN (${pin}) copied for ${eventName}!`);
  };

  const copyBouncerLink = (eventCode: string) => {
    const url = `${window.location.origin}/gate/${eventCode}`;
    navigator.clipboard.writeText(url);
    toast.success("Bouncer standalone link copied to clipboard!");
  };

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
        <p className="text-sm text-slate-500">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Gate Check-in & Scanner Module
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Launch live camera QR ticket scanners, copy staff gate PINs, or share bouncer access links.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-slate-200 text-slate-700 bg-white">
            {events.length} Events Available
          </Badge>
        </div>
      </div>

      {/* Quick Guide Card */}
      <Card className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/60 shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                How Gate Check-in Works
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                1. <strong>Launch Scanner:</strong> Use your phone or laptop camera to scan attendees' ticket barcodes.
                <br />
                2. <strong>Bouncers & Staff:</strong> Share the standalone bouncer URL and Gate PIN with security at the door. No login credentials required!
                <br />
                3. <strong>Offline Redundancy:</strong> Scan logs verify duplicate entries in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, code, or venue..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Event Scanner Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event: any) => {
            const isClosed = event.is_closed;
            const gatePIN = event.gate_passcode || "SH-GATE";

            return (
              <Card
                key={event.event_code}
                className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  {/* Event Thumbnail Banner */}
                  <div className="h-32 w-full relative bg-slate-100 overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Calendar className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        className={`text-[10px] font-bold ${
                          isClosed
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : event.is_published
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {isClosed ? "Closed" : event.is_published ? "Live Gate" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{event.venue || "Venue TBA"}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{format(new Date(event.start_date), "dd MMM yyyy")}</span>
                      </p>
                    </div>

                    {/* Gate PIN Strip */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Gate Access PIN
                        </span>
                        <p className="font-mono text-sm font-bold text-emerald-600 mt-0.5">
                          {gatePIN}
                        </p>
                      </div>
                      <button
                        onClick={() => copyPIN(gatePIN, event.name)}
                        title="Copy Gate PIN"
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 space-y-2">
                  <Button
                    onClick={() =>
                      router.push(`/company/${reference}/events/${event.event_code}/scan`)
                    }
                    className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Launch Gate Scanner</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyBouncerLink(event.event_code)}
                      className="h-8 text-[11px] border-slate-200 text-slate-700 hover:bg-slate-50 gap-1 rounded-lg"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Bouncer URL</span>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-[11px] border-slate-200 text-slate-700 hover:bg-slate-50 gap-1 rounded-lg"
                    >
                      <Link href={`/company/${reference}/events/${event.event_code}`}>
                        <span>CRM & Tickets</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white border border-slate-200 shadow-xs rounded-2xl p-12 text-center">
          <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No events found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create an event in your Events Hub to enable QR gate scanners and attendee check-in.
          </p>
          <Button
            onClick={() => router.push(`/company/${reference}/events/create`)}
            className="mt-4 h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
          >
            Create Event
          </Button>
        </Card>
      )}
    </div>
  );
}
