/* eslint-disable @typescript-eslint/no-explicit-any */
// app/events/page.tsx
"use client";

import { useFetchEvents } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Calendar, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "@/components/events/EventsCard";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

export default function EventsPage() {
  const { isLoading, data: events = [] } = useFetchEvents();
  const [nameQuery, setNameQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const openEvents = events.filter((event: any) => !event.is_closed);

  const filteredEvents = useMemo(() => {
    return openEvents.filter((event: any) => {
      const matchesName = event.name
        ?.toLowerCase()
        .includes(nameQuery.toLowerCase());
      const matchesDate = dateQuery
        ? event.start_date?.startsWith(dateQuery)
        : true;
      return matchesName && matchesDate;
    });
  }, [openEvents, nameQuery, dateQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [nameQuery, dateQuery]);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  const hasFilters = nameQuery || dateQuery;

  const clearFilters = () => {
    setNameQuery("");
    setDateQuery("");
  };

  // Build compact page number range (max 5 visible page numbers)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    const pages: (number | "...")[] = [1];
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-[var(--mainBlue)] to-[var(--mainRed)] pt-20 pb-8 px-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-5">
            Discover Events
          </h1>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Name Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by event name..."
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="pl-9 bg-white/95 border-0 shadow-sm h-10"
              />
            </div>

            {/* Date Filter */}
            <div className="relative sm:w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="date"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
                className="pl-9 bg-white/95 border-0 shadow-sm h-10"
              />
            </div>

            {/* Clear */}
            {hasFilters && (
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="h-10 px-4 bg-white/20 text-white hover:bg-white/30 border-0 shrink-0"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Results info */}
        <p className="text-sm text-muted-foreground mb-6">
          {hasFilters
            ? `${filteredEvents.length} result${filteredEvents.length !== 1 ? "s" : ""} found`
            : `${openEvents.length} event${openEvents.length !== 1 ? "s" : ""} available`}
          {totalPages > 1 && (
            <span className="ml-2 text-muted-foreground/60">
              · Page {currentPage} of {totalPages}
            </span>
          )}
        </p>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {hasFilters
                ? "Try adjusting your search."
                : "Check back soon — exciting sherehe are coming!"}
            </p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedEvents.map((event: any) => (
                <EventCard key={event.event_code} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers.map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
                      …
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className={`h-9 w-9 text-sm ${
                        currentPage === page
                          ? "bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white border-0"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
