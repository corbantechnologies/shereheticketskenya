/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

function EventCard({ event }: { event: any }) {
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t: any) => parseFloat(t.price)))
    : null;

  const priceText = lowestPrice
    ? `From KES ${lowestPrice.toLocaleString()}`
    : "Free";

  return (
    <Link href={`/events/${event.event_code}`} className="flex h-full">
      <Card className="group border-0 w-full max-w-[350px] max-h-[500px] overflow-hidden py-0 gap-0 hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col">

        {/* Image */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden bg-muted">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--mainBlue)] to-[var(--mainRed)] opacity-80" />
          )}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-foreground shadow backdrop-blur-sm px-3 py-1 text-xs font-semibold">
              {priceText}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <CardContent className="flex flex-col flex-grow pt-5 pb-3 px-5 overflow-hidden">
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-[var(--mainBlue)] transition-colors line-clamp-1">
            {event.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {event.description || "No description available."}
          </p>

          <div className="space-y-2 text-sm mt-auto">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="h-4 w-4 text-[var(--mainBlue)] shrink-0" />
              <span className="truncate">
                {format(new Date(event.start_date), "EEE, MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="h-4 w-4 text-[var(--mainBlue)] shrink-0" />
              <span className="line-clamp-1">{event.venue || "Venue TBA"}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Ticket className="h-4 w-4 text-[var(--mainRed)] shrink-0" />
              <span>{event.ticket_types?.length || 0} ticket types</span>
            </div>
          </div>
        </CardContent>

        {/* Footer CTA */}
        <CardFooter className="px-5 pb-5 pt-3">
          <Button className="w-full bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 shadow-sm text-sm">
            View Details &amp; Book
          </Button>
        </CardFooter>

      </Card>
    </Link>
  );
}

export default EventCard;
