/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/events/[event_code]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { useFetchEvent } from "@/hooks/events/actions";
import TicketTypeChip from "@/components/events/TicketTypeChip";
import MakeBooking from "@/forms/bookings/MakeBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

function getEventStatus(event: any): { label: string; color: string } | null {
  if (event.is_closed) return { label: "Closed", color: "bg-red-500/80" };
  const now = new Date();
  const start = new Date(event.start_date);
  const diffDays = Math.ceil(
    (start.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return { label: "Today", color: "bg-green-500/80" };
  if (diffDays === 1) return { label: "Tomorrow", color: "bg-blue-500/80" };
  if (diffDays <= 7) return { label: "This Week", color: "bg-[var(--mainBlue)]/80" };
  if (diffDays <= 14) return { label: "This Month", color: "bg-purple-500/80" };
  return null;
}

export default function EventDetailPage() {
  const { event_code } = useParams<{ event_code: string }>();
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const {
    isLoading: isLoadingEvent,
    data: event,
    refetch: refetchEvent,
  } = useFetchEvent(event_code);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "TBA";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTicketDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const getLowestPrice = () => {
    if (!event?.ticket_types?.length) return null;
    return Math.min(...event.ticket_types.map((t: any) => parseFloat(t.price)));
  };

  const hasBookableTickets = event?.ticket_types?.some(
    (t: any) => t.status === "ON_SALE" || !t.status
  );

  const defaultImage =
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=400&fit=crop";

  if (isLoadingEvent) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const status = getEventStatus(event);

  return (
    <div className="min-h-screen bg-[#d5d5d5]">
      {/* Booking Modal */}
      {showBookingModal && (
        <MakeBooking
          event={event}
          closeModal={() => setShowBookingModal(false)}
          refetchEvent={refetchEvent}
        />
      )}

      {/* Hero Banner */}
      <div className="relative h-[55vh] md:h-[420px] w-full overflow-hidden bg-black/90">
        {/* Blurred background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${event.image || defaultImage})` }}
        />
        {/* Main image */}
        <div className="relative h-full w-full flex items-center justify-center z-10 p-4">
          <img
            src={event.image || defaultImage}
            alt={event.name}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

        {/* Back button — overlay pill */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 z-30 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Status badge */}
        {status && (
          <span className={`absolute top-5 right-5 z-30 text-xs font-medium text-white px-3 py-1 rounded-full backdrop-blur-sm ${status.color}`}>
            {status.label}
          </span>
        )}

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-30">
          <div className="mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 drop-shadow-lg">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-3 sm:gap-5 text-white/85 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(event.start_time)}
                  {event.end_time && ` – ${formatTime(event.end_time)}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{event.venue || "Venue TBA"}</span>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{event.capacity} capacity</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Left — Event Info */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <Card className="py-0 border-none shadow-lg bg-white">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-foreground">About this event</h2>
                {event.content ? (
                  <RichTextDisplay content={event.content} />
                ) : (
                  <p className="text-foreground/70 text-sm leading-relaxed whitespace-pre-line">
                    {event.description || "No details provided yet."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="py-0 border-none shadow-lg bg-white">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-foreground">Cancellation policy</h2>
                {event.refund_policy ? (
                  <RichTextDisplay content={event.refund_policy} />
                ) : (
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    No cancellation policy specified for this event.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right — Ticket Selection */}
          <div className="lg:col-span-1">
            {event.is_closed ? (
              <Card className="py-0 border-none shadow-lg lg:sticky top-6 text-center bg-white">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    This event is closed. No tickets are available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="py-0 border-none shadow-lg lg:sticky top-6 bg-white">
                <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4 text-foreground">Select tickets</h2>
                <div className="space-y-3">
                  {event.ticket_types?.length > 0 ? (
                    <>
                      {event.ticket_types.map((ticket: any) => {
                        const isEligible =
                          ticket.status === "ON_SALE" || !ticket.status;
                        const isStruckThrough =
                          ticket.status === "SOLD_OUT" ||
                          ticket.status === "ENDED";

                        const statusColors: Record<string, string> = {
                          ON_SALE: "bg-green-100 text-green-800 border-green-200",
                          SOLD_OUT: "bg-red-100 text-red-800 border-red-200",
                          UPCOMING: "bg-blue-100 text-blue-800 border-blue-200",
                          PAUSED: "bg-yellow-100 text-yellow-800 border-yellow-200",
                          ENDED: "bg-gray-100 text-gray-800 border-gray-200",
                        };

                        return (
                          <Card
                            key={ticket.reference}
                            className={`shadow-sm transition-shadow p-0  ${
                              isEligible
                                ? "hover:shadow-md cursor-pointer"
                                : "opacity-55 cursor-not-allowed bg-muted/20"
                            }`}
                            onClick={() => {
                              if (isEligible) setShowBookingModal(true);
                            }}
                          >
                            <CardContent className="py-3 px-2">
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <div>
                                <h4
                                  className={`text-sm font-medium flex flex-wrap items-center gap-2 ${
                                    isStruckThrough
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {ticket.name}
                                  {ticket.status && ticket.status !== "ON_SALE" && (
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full border font-medium no-underline ${
                                        statusColors[ticket.status] ??
                                        "bg-muted text-muted-foreground border-border"
                                      }`}
                                    >
                                      {ticket.status.replace("_", " ")}
                                    </span>
                                  )}
                                </h4>
                                <p
                                  className={`text-lg font-semibold mt-0.5 ${
                                    isStruckThrough
                                      ? "line-through text-muted-foreground"
                                      : "text-[var(--mainBlue)]"
                                  }`}
                                >
                                  KES {parseFloat(ticket.price).toLocaleString()}
                                </p>
                              </div>
                              <TicketTypeChip
                                ticketType={ticket}
                                isLowestPrice={
                                  parseFloat(ticket.price) === getLowestPrice()
                                }
                              />
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {ticket.quantity_available !== null ? (
                                ticket.quantity_available <= 10 ? (
                                  <span className="text-orange-600 font-medium">
                                    Only {ticket.quantity_available} left!
                                  </span>
                                ) : (
                                  <span>{ticket.quantity_available} available</span>
                                )
                              ) : (
                                <span>Unlimited</span>
                              )}
                              {!isEligible && (
                                <p className="text-red-500/80 mt-1">
                                  {ticket.status === "UPCOMING" && ticket.sales_start
                                    ? `Sales open ${formatTicketDate(ticket.sales_start)}`
                                    : ticket.status === "ENDED" && ticket.sales_end
                                    ? `Sales ended ${formatTicketDate(ticket.sales_end)}`
                                    : "Currently unavailable"}
                                </p>
                              )}
                            </div>
                            </CardContent>
                          </Card>
                        );
                      })}

                      <Button
                        onClick={() => setShowBookingModal(true)}
                        disabled={!hasBookableTickets}
                        className="w-full bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white py-5 mt-1 disabled:opacity-50"
                      >
                        {hasBookableTickets ? "Get Tickets" : "No Tickets Available"}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        Secure payment processing
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No tickets available for this event
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {!event.is_closed && hasBookableTickets && (
        <div className="lg:hidden bg-white fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{event.name}</p>
            {getLowestPrice() && (
              <p className="text-sm font-medium text-foreground">
                From KES {getLowestPrice()!.toLocaleString()}
              </p>
            )}
          </div>
          <Button
            onClick={() => setShowBookingModal(true)}
            className="shrink-0 bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white px-5"
          >
            Get Tickets
          </Button>
        </div>
      )}
    </div>
  );
}
