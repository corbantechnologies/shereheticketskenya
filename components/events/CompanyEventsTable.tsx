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
  start_time?: string | null;
  end_time?: string | null;
  is_closed: boolean;
}

interface CompanyEventsTableProps {
  events: Event[];
  companyReference: string;
}

function formatTime(time?: string | null) {
  if (!time) return "—";
  const [hours, minutes] = time.split(":");
  const d = new Date();
  d.setHours(parseInt(hours));
  d.setMinutes(parseInt(minutes));
  return format(d, "hh:mma");
}

export default function CompanyEventsTable({
  events,
  companyReference,
}: CompanyEventsTableProps) {
  const router = useRouter();
  const go = (code: string) =>
    router.push(`/company/${companyReference}/events/${code}`);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b border-gray-200">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Event</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Date</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Venue</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Hours</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
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
                {formatTime(event.start_time)} – {formatTime(event.end_time)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={event.is_closed ? "secondary" : "default"}
                  className={`text-xs px-2 py-0.5 ${
                    event.is_closed
                      ? "bg-gray-100 text-gray-500"
                      : "bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {event.is_closed ? "Closed" : "Active"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-left">
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
