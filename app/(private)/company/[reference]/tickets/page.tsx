/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  Download,
  Filter,
  Eye,
  QrCode,
  Tag,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CompanyTicketsHubPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventCode, setSelectedEventCode] = useState<string>("ALL");
  const [checkInFilter, setCheckInFilter] = useState<"ALL" | "CHECKED_IN" | "NOT_CHECKED_IN">("ALL");

  const events = company?.company_events || [];

  // Extract all bookings across all company events
  const allTickets = useMemo(() => {
    const list: any[] = [];
    events.forEach((evt: any) => {
      (evt.ticket_types || []).forEach((tier: any) => {
        (tier.bookings || []).forEach((booking: any) => {
          list.push({
            ...booking,
            event_name: evt.name,
            event_code: evt.event_code,
            tier_name: tier.name,
            tier_price: tier.price,
            event_date: evt.start_date,
          });
        });
      });
    });
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [events]);

  const totalTicketsSold = useMemo(() => {
    return allTickets.reduce((acc, t) => acc + (t.quantity || 1), 0);
  }, [allTickets]);

  const totalRevenue = useMemo(() => {
    return allTickets.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [allTickets]);

  const checkedInCount = useMemo(() => {
    return allTickets.filter((b) => (b.tickets || []).some((t: any) => t.is_used)).length;
  }, [allTickets]);

  const filteredTickets = useMemo(() => {
    return allTickets.filter((item: any) => {
      // Event filter
      if (selectedEventCode !== "ALL" && item.event_code !== selectedEventCode) {
        return false;
      }

      // Check-in filter
      const isCheckedIn = (item.tickets || []).some((t: any) => t.is_used);
      if (checkInFilter === "CHECKED_IN" && !isCheckedIn) return false;
      if (checkInFilter === "NOT_CHECKED_IN" && isCheckedIn) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesPhone = item.phone?.includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesRef = item.reference?.toLowerCase().includes(q);
        const matchesCode = (item.tickets || []).some((t: any) =>
          t.ticket_code?.toLowerCase().includes(q)
        );
        const matchesEvent = item.event_name?.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesEmail || matchesRef || matchesCode || matchesEvent;
      }

      return true;
    });
  }, [allTickets, selectedEventCode, checkInFilter, searchQuery]);

  const handleExportCSV = () => {
    if (filteredTickets.length === 0) {
      toast.error("No attendee tickets available to export.");
      return;
    }

    const headers = [
      "Attendee Name",
      "Phone",
      "Email",
      "Event",
      "Tier",
      "Quantity",
      "Amount (KES)",
      "Booking Ref",
      "Status",
      "Created Date",
    ];

    const rows = filteredTickets.map((t: any) => {
      const isCheckedIn = (t.tickets || []).some((tk: any) => tk.is_used);
      return [
        `"${t.name || ""}"`,
        `"${t.phone || ""}"`,
        `"${t.email || ""}"`,
        `"${t.event_name || ""}"`,
        `"${t.tier_name || ""}"`,
        t.quantity || 1,
        t.amount || 0,
        `"${t.reference || ""}"`,
        isCheckedIn ? "Checked In" : "Not Checked",
        `"${t.created_at ? format(new Date(t.created_at), "yyyy-MM-dd HH:mm") : ""}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tickets_${company?.name || "export"}_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendee tickets exported to CSV!");
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
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Ticket className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Tickets &amp; Attendees Hub
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized registry of all ticket passes, attendee bookings, and QR barcodes for {company.name}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-9 text-xs gap-1.5 border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => router.push(`/company/${reference}/scan`)}
            className="h-9 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 rounded-xl shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Gate Scanner</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Total Tickets Sold</span>
              <Ticket className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalTicketsSold}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across {events.length} events</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Gross Ticket Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">
              KES {totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{allTickets.length} confirmed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Checked In at Gate</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{checkedInCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {allTickets.length > 0
                ? `${Math.round((checkedInCount / allTickets.length) * 100)}% check-in rate`
                : "No attendees yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Active Events</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {events.filter((e: any) => !e.is_closed && e.is_published).length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">of {events.length} total events</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by attendee name, phone, ticket code, booking ref, or event..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Event Selector & Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedEventCode}
                onChange={(e) => setSelectedEventCode(e.target.value)}
                className="h-9 px-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Events ({events.length})</option>
                {events.map((evt: any) => (
                  <option key={evt.event_code} value={evt.event_code}>
                    {evt.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setCheckInFilter("ALL")}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    checkInFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  All ({allTickets.length})
                </button>
                <button
                  onClick={() => setCheckInFilter("CHECKED_IN")}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    checkInFilter === "CHECKED_IN" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Checked In
                </button>
                <button
                  onClick={() => setCheckInFilter("NOT_CHECKED_IN")}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    checkInFilter === "NOT_CHECKED_IN" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Not Scanned
                </button>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          {filteredTickets.length > 0 ? (
            <div className="rounded-xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3">Attendee</th>
                    <th className="text-left px-4 py-3">Event</th>
                    <th className="text-left px-4 py-3">Tier</th>
                    <th className="text-left px-4 py-3">Qty / Amount</th>
                    <th className="text-left px-4 py-3">Booking Ref</th>
                    <th className="text-left px-4 py-3">Gate Status</th>
                    <th className="text-right px-4 py-3">Pass Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((item: any) => {
                    const isCheckedIn = (item.tickets || []).some((t: any) => t.is_used);
                    const firstTicket = (item.tickets || [])[0];

                    return (
                      <tr key={item.reference} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-slate-500 font-mono text-[11px]">{item.phone}</p>
                          {item.email && <p className="text-slate-400 text-[10px]">{item.email}</p>}
                        </td>

                        <td className="px-4 py-3">
                          <Link
                            href={`/company/${reference}/events/${item.event_code}`}
                            className="font-medium text-blue-600 hover:underline line-clamp-1"
                          >
                            {item.event_name}
                          </Link>
                          <p className="text-slate-400 text-[10px] font-mono">{item.event_code}</p>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800">{item.tier_name}</span>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{item.quantity} tickets</p>
                          <p className="text-emerald-600 font-medium">KES {Number(item.amount).toLocaleString()}</p>
                        </td>

                        <td className="px-4 py-3">
                          <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {item.reference}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Not Scanned
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] border-slate-200 text-slate-700 hover:bg-slate-100 px-2.5 gap-1 rounded-lg"
                            >
                              <Link href={`/tickets/${item.reference}`} target="_blank">
                                <Eye className="w-3 h-3" />
                                <span>Pass</span>
                              </Link>
                            </Button>

                            <Button
                              asChild
                              size="sm"
                              variant="ghost"
                              className="h-7 text-[11px] text-blue-600 hover:bg-blue-50 px-2 gap-1 rounded-lg"
                            >
                              <Link href={`/company/${reference}/events/${item.event_code}`}>
                                <span>Event</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tickets found matching your search and filter criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
