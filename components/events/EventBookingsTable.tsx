/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface EventBookingsTableProps {
  bookings: any[];
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

export default function EventBookingsTable({ bookings }: EventBookingsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.booking_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name, email or code…"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="h-8 px-3 text-xs bg-white border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {paginated.length > 0 ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-muted/40 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Code</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Attendee</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Ticket type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Qty</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginated.map((b) => (
                <tr key={b.reference} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {b.booking_code}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.email}</p>
                    {b.phone && <p className="text-xs text-muted-foreground">{b.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {b.ticket_type_info?.name || "Standard"}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{b.quantity}</td>
                  <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                    {b.currency} {Number(b.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-xs px-2 py-0.5 border ${STATUS_STYLES[b.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(b.created_at), "dd MMM yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-8">
          {bookings.length === 0 ? "No bookings yet." : "No bookings match your search."}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            {start + 1}–{Math.min(start + itemsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0 border-gray-200"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 p-0 text-xs ${
                  currentPage === page
                    ? "bg-[var(--mainBlue)] text-white border-[var(--mainBlue)]"
                    : "border-gray-200"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0 border-gray-200"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
