/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Ticket, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: any;
}

export default function EventCard({ event }: EventCardProps) {
  const lowestPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map((t: any) => parseFloat(t.price)))
    : null;

  const priceText = lowestPrice !== null && lowestPrice > 0
    ? `KES ${lowestPrice.toLocaleString()}`
    : "Free Entry";

  const eventDate = event.start_date ? new Date(event.start_date) : new Date();
  const dayStr = format(eventDate, "d");
  const monthStr = format(eventDate, "MMM");

  return (
    <Link
      href={`/events/${event.event_code}`}
      className="group block h-full select-none focus:outline-none"
    >
      <div className="h-full bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col">
        {/* Banner Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900/80 via-slate-900 to-rose-950/80 flex items-center justify-center">
              <Ticket className="h-12 w-12 text-slate-700" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Top Left: Date Chip */}
          <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-2.5 py-1 text-center shadow-lg">
            <span className="block text-[10px] font-bold text-rose-400 uppercase leading-none">
              {monthStr}
            </span>
            <span className="block text-base font-extrabold text-white leading-tight">
              {dayStr}
            </span>
          </div>

          {/* Top Right: Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-slate-950/85 hover:bg-slate-900 text-slate-100 border border-slate-700/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold shadow-lg">
              {priceText}
            </Badge>
          </div>

          {/* Bottom Left Category Tag */}
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[11px] font-semibold text-cyan-300 tracking-wide bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {event.category || "Music & Live"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {event.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {event.description || "Join us for an unforgettable event experience in Kenya."}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="truncate">
                {format(eventDate, "EEEE, MMMM d, yyyy")}
                {event.start_time && ` • ${event.start_time.slice(0, 5)}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span className="truncate text-slate-300 font-medium">
                {event.venue || "Venue TBA"}
              </span>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              {event.ticket_types?.length || 1} ticket tiers
            </span>
            <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Get Tickets <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
