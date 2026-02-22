/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

function EventCard({ event }: { event: any }) {
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t: any) => parseFloat(t.price)))
    : null;

  const priceText = lowestPrice
    ? `From KES ${lowestPrice.toLocaleString()}`
    : "Free";

  return (
    <Link href={`/events/${event.event_code}`}>
      <div className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-border">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--mainBlue)] to-[var(--mainRed)] opacity-80" />
          )}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-foreground shadow-sm backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
              {priceText}
            </Badge>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-[var(--mainBlue)] transition-colors">
            {event.name}
          </h3>

          <p className="text-muted-foreground line-clamp-2 mb-6">
            {event.description || "No description available."}
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-foreground/80">
              <Calendar className="h-5 w-5 text-[var(--mainBlue)]" />
              <span>
                {format(new Date(event.start_date), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <MapPin className="h-5 w-5 text-[var(--mainBlue)]" />
              <span>{event.venue || "Venue TBA"}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/80">
              <Ticket className="h-5 w-5 text-[var(--mainRed)]" />
              <span>{event.ticket_types?.length || 0} ticket types</span>
            </div>
          </div>

          <Button className="w-full mt-8 bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 shadow-md">
            View Details & Book
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
