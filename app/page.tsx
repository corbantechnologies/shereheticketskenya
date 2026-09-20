/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/general/Footer";
import EventCard from "@/components/events/EventsCard";
import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Zap,
  Ticket,
  Flame,
  Music,
  PartyPopper,
  Laptop,
  Trophy,
  UtensilsCrossed,
  Layers,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isLoading, data: events = [] } = useFetchEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Kenya");

  const openEvents = events.filter((event: any) => !event.is_closed);
  const featuredEvents = openEvents.slice(0, 8);

  const categories = [
    { name: "All", icon: Layers, count: openEvents.length },
    { name: "Concerts", icon: Music, query: "Concerts" },
    { name: "Festivals", icon: PartyPopper, query: "Festivals" },
    { name: "Tech & Biz", icon: Laptop, query: "Tech" },
    { name: "Sports", icon: Trophy, query: "Sports" },
    { name: "Food & Drinks", icon: UtensilsCrossed, query: "Food" },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/events");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH DYNAMIC SEARCH PILL                                 */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Glowing Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-5xl text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-inner animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Kenya’s Premier Live Events & Ticketing Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Experience Unforgettable{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-rose-400 to-amber-400">
              Sherehe.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover concerts, festivals, tech conferences, and campus gatherings across Kenya. Instant M-Pesa checkout with 100% verified digital QR passes.
          </p>

          {/* Integrated Search Bar Pill */}
          <form
            onSubmit={handleHeroSearch}
            className="w-full max-w-2xl mx-auto mt-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search event, artist, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 pl-10 text-white placeholder:text-slate-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
              />
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="relative w-full sm:w-44">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent border-0 pl-10 pr-4 text-slate-300 text-xs font-semibold focus:outline-none h-11 appearance-none cursor-pointer"
              >
                <option value="All Kenya" className="bg-slate-900 text-white">All Kenya</option>
                <option value="Nairobi" className="bg-slate-900 text-white">Nairobi</option>
                <option value="Mombasa" className="bg-slate-900 text-white">Mombasa</option>
                <option value="Nakuru" className="bg-slate-900 text-white">Nakuru</option>
                <option value="Kisumu" className="bg-slate-900 text-white">Kisumu</option>
                <option value="Eldoret" className="bg-slate-900 text-white">Eldoret</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-bold px-6 h-11 rounded-xl shadow-lg shadow-blue-600/20 text-xs"
            >
              Explore Events
            </Button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.query ? `/events?category=${cat.query}` : "/events"}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED & TRENDING EVENTS GRID                                       */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 bg-slate-900/30 border-y border-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Upcoming & Trending Events
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Grab your tickets before early-bird allocations sell out.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 text-xs rounded-xl"
            >
              <Link href="/events" className="flex items-center gap-1.5">
                <span>View All ({openEvents.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-4">
              <Ticket className="h-14 w-14 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No events currently scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check back soon or create your own event to start selling tickets today.
              </p>
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                <Link href="/organizers">Host an Event</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredEvents.map((event: any) => (
                <EventCard key={event.event_code} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "WHY SHEREHE" TRUST & SPEED HIGHLIGHTS                                */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built for Speed, Zero Fraud & Total Peace of Mind
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              We eliminated the pain points of buying and managing event tickets in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Instant M-Pesa STK Push</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No manual Paybill numbers or copy-pasting reference codes. Enter your phone number, input your M-Pesa PIN on your phone, and receive confirmed tickets in seconds.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Verified Digital QR Passes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every ticket generates an immutable, tamper-proof QR code. Our high-speed gate scanner flags duplicate entry attempts with instant alarms, eliminating counterfeit tickets.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Channel Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never lose your ticket. Save passes directly to your WhatsApp, download high-resolution wallet PDFs, or show your pass on any mobile browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CREATOR & ORGANIZER BANNER CTA                                        */}
      {/* ========================================================================= */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                Zero Setup Fees
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hosting an event? Sell tickets with Sherehe.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                Set up ticket tiers in 3 minutes, accept M-Pesa payments, track sales in real-time, and scan attendees at the gate with any smartphone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Button asChild size="lg" className="bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-sm shadow-xl">
                <Link href="/organizers">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
