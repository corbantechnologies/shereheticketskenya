"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/general/Footer";
import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import EventCard from "@/components/events/EventsCard";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isLoading, data: events = [] } = useFetchEvents();
  const openEvents = events.filter((event: any) => !event.is_closed).slice(0, 9);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {/* Simple Hero for Landing */}
        <section className="relative overflow-hidden bg-background pt-32 pb-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[var(--mainBlue)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--mainRed)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mainBlue)] to-[var(--mainRed)]">Sherehe?</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover and book tickets to the most exciting events in Kenya.
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
                <p className="text-muted-foreground text-lg">Don&apos;t miss out on these amazing experiences</p>
              </div>
              <Button variant="ghost" className="text-[var(--mainBlue)] font-semibold hover:text-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/10" asChild>
                <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : openEvents.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                <Calendar className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl font-semibold mb-3">No Events At The Moment</h3>
                <p className="text-lg text-muted-foreground">Check back later for new events!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {openEvents.map((event: any) => (
                  <EventCard key={event.event_code} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
