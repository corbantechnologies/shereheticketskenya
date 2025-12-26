// components/events/EventsDisplayTable.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Event {
  reference: string;
  event_code: string;
  name: string;
  start_date: string;
  venue: string | null;
  is_closed: boolean;
  ticket_types: Array<{
    name: string;
    price: string;
    quantity_available: number | null;
    is_limited: boolean;
  }>;
}

interface EventsDisplayTableProps {
  events: Event[];
  companyReference: string;
}

export default function EventsDisplayTable({ events, companyReference }: EventsDisplayTableProps) {
  const router = useRouter();

  const getTicketCount = (event: Event) => event.ticket_types?.length || 0;

  const getTotalCapacity = (event: Event) => {
    if (!event.ticket_types) return "Unlimited";
    const limited = event.ticket_types
      .filter((t) => t.is_limited && t.quantity_available !== null)
      .reduce((sum, t) => sum + t.quantity_available!, 0);
    return limited > 0 ? limited.toString() : "Unlimited";
  };

  const handleRowClick = (eventCode: string) => {
    router.push(`/company/${companyReference}/events/${eventCode}`);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--background)]/30 rounded-lg border border-dashed border-[var(--border)]">
        <div className="bg-[var(--secondary)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-[var(--muted-foreground)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">No events found</h3>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">
            Get started by creating your first event for this company.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[var(--secondary)]">
          <TableRow className="hover:bg-[var(--secondary)] border-b border-[var(--border)]">
            <TableHead className="font-semibold text-[var(--foreground)] w-[30%]">Event Name</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)]">Date</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)]">Venue</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)] text-center">Tickets</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)] text-center">Capacity</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)]">Status</TableHead>
            <TableHead className="font-semibold text-[var(--foreground)] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.reference}
              className="cursor-pointer hover:bg-[var(--secondary)]/40 transition-colors border-b border-[var(--border)] last:border-0"
              onClick={() => handleRowClick(event.event_code)}
            >
              <TableCell className="font-mediumpy-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-[var(--foreground)] text-base">{event.name}</span>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mt-0.5">
                    {event.event_code}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--primary)]/70" />
                  {format(new Date(event.start_date), "MMM d, yyyy")}
                </div>
              </TableCell>
              <TableCell className="text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--primary)]/70" />
                  {event.venue || "TBA"}
                </div>
              </TableCell>
              <TableCell className="text-center">
                 <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--secondary)] text-[var(--foreground)]">
                    {getTicketCount(event)} Types
                 </div>
              </TableCell>
              <TableCell className="text-center">
                 <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTotalCapacity(event) === "Unlimited" ? "bg-green-50 text-green-700 border border-green-200" : "bg-[var(--secondary)] text-[var(--foreground)]"}`}>
                    {getTotalCapacity(event)}
                 </div>
              </TableCell>
              <TableCell>
                <Badge 
                    variant={event.is_closed ? "secondary" : "default"}
                    className={event.is_closed 
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200" 
                        : "bg-green-600 hover:bg-green-700 text-white border-transparent"}
                >
                  {event.is_closed ? "Closed" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(event.event_code);
                  }}
                  className="text-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}