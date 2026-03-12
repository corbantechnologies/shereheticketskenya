// components/events/EventsDisplayTable.tsx
"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function EventsDisplayTable({
  events,
  companyReference,
}: EventsDisplayTableProps) {
  const router = useRouter();
  const go = (code: string) =>
    router.push(`/company/${companyReference}/events/${code}`);

  const getCapacity = (event: Event) => {
    if (!event.ticket_types?.length) return "—";
    const limited = event.ticket_types
      .filter((t) => t.is_limited && t.quantity_available !== null)
      .reduce((sum, t) => sum + t.quantity_available!, 0);
    return limited > 0 ? limited.toLocaleString() : "Unlimited";
  };

  if (events.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-8">
        No events found.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b border-gray-200">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Event</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Venue</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Tickets</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Capacity</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {events.map((event) => (
            <tr
              key={event.reference}
              className="hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => go(event.event_code)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{event.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{event.event_code}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                {format(new Date(event.start_date), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                {event.venue || "TBA"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                {event.ticket_types?.length ?? 0} type{event.ticket_types?.length !== 1 ? "s" : ""}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                {getCapacity(event)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  className={`text-xs px-2 py-0.5 border ${
                    event.is_closed
                      ? "bg-gray-100 text-gray-500 border-gray-200"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {event.is_closed ? "Closed" : "Active"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  className="inline-flex items-center gap-1 text-xs text-[var(--mainBlue)] hover:underline"
                  onClick={(e) => { e.stopPropagation(); go(event.event_code); }}
                >
                  Manage <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
