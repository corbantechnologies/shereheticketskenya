"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/general/Footer";
import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import EventCard from "@/components/events/EventsCard";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { isLoading, data: events = [] } = useFetchEvents();
  const openEvents = events.filter((event: any) => !event.is_closed).slice(0, 9);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--mainBlue)]/5 via-background to-[var(--mainRed)]/5 pt-24 pb-12">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-[var(--mainBlue)]/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--mainRed)]/10 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/sherehe.jpg"
                  alt="Sherehe Events"
                  fill
                  className="object-cover"
                  priority
                />
                {/* subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
              </div>
            </div>

            {/* Text */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--mainBlue)] mb-3">
                Kenya&apos;s #1 Ticketing Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-5 leading-tight">
                Piga{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mainBlue)] to-[var(--mainRed)]">
                  Sherehe
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                Discover and book tickets to the most exciting events in Kenya. From concerts to conferences — we&apos;ve got you covered.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white px-6 py-5 text-base rounded-xl shadow-md">
                  <Link href="/events">Browse Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="px-6 py-5 text-base rounded-xl border-[var(--mainBlue)] text-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/5">
                  <Link href="/organizers">Host an Event</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
      <main>
        {/* Events Grid */}
        <section className="py-6 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center items-start mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Upcoming Events</h2>
                <p className="text-muted-foreground text-base">Don&apos;t miss out on these amazing experiences</p>
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
