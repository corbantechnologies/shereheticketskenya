/* eslint-disable @typescript-eslint/no-explicit-any */
// app/events/page.tsx
"use client";

import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Calendar } from "lucide-react";
import EventCard from "@/components/events/EventsCard";

export default function EventsPage() {
  const { isLoading, data: events = [] } = useFetchEvents();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-96 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--mainBlue)] via-[var(--mainBlue)]/90 to-[var(--mainRed)]" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Discover Events
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-95">
            Find and book tickets to the best sherehe in town
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="p-6 md:p-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground">
            {events.length} amazing events waiting for you
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-3">No Events Yet</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Check back soon — exciting sherehe are coming!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event: any) => (
              <EventCard key={event.event_code} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
