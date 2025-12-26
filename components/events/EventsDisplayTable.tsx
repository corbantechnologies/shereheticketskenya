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
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No events found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead className="text-center">Tickets</TableHead>
            <TableHead className="text-center">Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.reference}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(event.event_code)}
            >
              <TableCell className="font-medium">
                <div>
                  {event.name}
                  <p className="text-sm text-muted-foreground">
                    Code: {event.event_code}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(event.start_date), "PPP")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {event.venue || "Not set"}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  <Ticket className="h-3 w-3 mr-1" />
                  {getTicketCount(event)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getTotalCapacity(event) === "Unlimited" ? "outline" : "secondary"}>
                  <Users className="h-3 w-3 mr-1" />
                  {getTotalCapacity(event)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={event.is_closed ? "destructive" : "default"}>
                  {event.is_closed ? "Closed" : "Open"}
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
                >
                  Manage →
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}