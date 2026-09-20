/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/general/Footer";
import EventCard from "@/components/events/EventsCard";
import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Ticket,
  Music,
  PartyPopper,
  Laptop,
  Trophy,
  UtensilsCrossed,
  Layers,
} from "lucide-react";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";

const PAGE_SIZE = 16;

export default function EventsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";

  const { isLoading, data: events = [] } = useFetchEvents();
  const [nameQuery, setNameQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [dateFilter, setDateFilter] = useState<"ALL" | "TODAY" | "WEEKEND" | "MONTH">("ALL");
  const [sortBy, setSortBy] = useState<"DATE" | "PRICE_ASC" | "PRICE_DESC">("DATE");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { name: "All", icon: Layers },
    { name: "Concerts", icon: Music },
    { name: "Festivals", icon: PartyPopper },
    { name: "Tech", icon: Laptop },
    { name: "Sports", icon: Trophy },
    { name: "Food", icon: UtensilsCrossed },
  ];

  const openEvents = useMemo(() => {
    return events.filter((event: any) => !event.is_closed);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return openEvents
      .filter((event: any) => {
        // Name / Venue / Description search
        if (nameQuery.trim()) {
          const q = nameQuery.toLowerCase();
          const matchName = event.name?.toLowerCase().includes(q);
          const matchVenue = event.venue?.toLowerCase().includes(q);
          const matchDesc = event.description?.toLowerCase().includes(q);
          if (!matchName && !matchVenue && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          const catLower = selectedCategory.toLowerCase();
          const eventCat = (event.category || "").toLowerCase();
          const eventName = (event.name || "").toLowerCase();
          if (!eventCat.includes(catLower) && !eventName.includes(catLower)) {
            return false;
          }
        }

        // Date filter
        if (dateFilter !== "ALL" && event.start_date) {
          const d = new Date(event.start_date);
          if (dateFilter === "TODAY" && !isToday(d)) return false;
          if (dateFilter === "WEEKEND" && !isThisWeek(d)) return false;
          if (dateFilter === "MONTH" && !isThisMonth(d)) return false;
        }

        return true;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "DATE") {
          return new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime();
        }
        const getLowestPrice = (ev: any) =>
          ev.ticket_types?.length ? Math.min(...ev.ticket_types.map((t: any) => parseFloat(t.price))) : 0;

        if (sortBy === "PRICE_ASC") return getLowestPrice(a) - getLowestPrice(b);
        if (sortBy === "PRICE_DESC") return getLowestPrice(b) - getLowestPrice(a);
        return 0;
      });
  }, [openEvents, nameQuery, selectedCategory, dateFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nameQuery, selectedCategory, dateFilter, sortBy]);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  const hasActiveFilters = nameQuery || selectedCategory !== "All" || dateFilter !== "ALL";

  const clearAllFilters = () => {
    setNameQuery("");
    setSelectedCategory("All");
    setDateFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="pt-28 pb-8 px-4 sm:px-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border-b border-slate-900">
        <div className="container mx-auto max-w-6xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Compass className="h-8 w-8 text-cyan-400" />
                Discover Events in Kenya
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore {openEvents.length} upcoming concerts, festivals, tech meetups, and sports tournaments.
              </p>
            </div>

            {/* Search Input in Header */}
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search events or venues..."
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 pl-10 text-xs h-10 rounded-xl focus:border-cyan-500"
              />
              {nameQuery && (
                <button
                  onClick={() => setNameQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sub-Filters: Date & Sorting Bar */}
      <section className="bg-slate-900/40 border-b border-slate-900 px-4 sm:px-6 py-3">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Date quick-pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium mr-1 hidden sm:inline">Date:</span>
            {[
              { label: "Anytime", val: "ALL" },
              { label: "Today", val: "TODAY" },
              { label: "This Weekend", val: "WEEKEND" },
              { label: "This Month", val: "MONTH" },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setDateFilter(d.val as any)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  dateFilter === d.val
                    ? "bg-slate-800 text-cyan-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Sort selector & Count */}
          <div className="flex items-center gap-3 ml-auto">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-rose-400 hover:text-rose-300 font-semibold text-[11px] flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset Filters
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="DATE">Soonest Date</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Grid */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 flex-1">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : paginatedEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 space-y-4 max-w-md mx-auto">
            <Ticket className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No matching events found</h3>
            <p className="text-xs text-slate-400">
              Try clearing your search or switching categories to discover other events.
            </p>
            <Button
              onClick={clearAllFilters}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {paginatedEvents.map((event: any) => (
                <EventCard key={event.event_code} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="bg-slate-900 border-slate-800 text-slate-300 text-xs h-9 px-3 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>

                <div className="text-xs text-slate-400 font-medium px-2">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="bg-slate-900 border-slate-800 text-slate-300 text-xs h-9 px-3 rounded-xl"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
