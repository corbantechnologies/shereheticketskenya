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

export default function EventDetailPage() {
  const { event_code } = useParams<{ event_code: string }>();
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const {
    isLoading: isLoadingEvent,
    data: event,
    refetch: refetchEvent,
  } = useFetchEvent(event_code);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "TBA";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLowestPrice = () => {
    if (!event?.ticket_types || event.ticket_types.length === 0) return null;
    const prices = event.ticket_types.map((ticket: any) =>
      parseFloat(ticket.price)
    );
    return Math.min(...prices);
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=400&fit=crop";

  if (isLoadingEvent) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-xl">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Booking Modal */}
      {showBookingModal && (
        <MakeBooking
          event={event}
          closeModal={() => setShowBookingModal(false)}
          refetchEvent={refetchEvent}
        />
      )}

      {/* Sticky Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4 flex items-center justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-md transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-96 w-full overflow-hidden bg-black/90">
        {/* Blurred Background Layer for filling space */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${event.image || defaultImage})` }}
        />

        {/* Main Image Layer (Full Visibility) */}
        <div className="relative h-full w-full flex items-center justify-center z-10 p-4">
          <img
            src={event.image || defaultImage}
            alt={event.name}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

        <div className="absolute bottom-0 left-0 right-0 p-8 z-30">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                <span>{event.venue || "Venue TBA"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Event Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <div className="bg-card rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-foreground/80 text-lg leading-relaxed">
                {event.description || "No description provided yet."}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-card rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-[var(--mainBlue)] mt-1" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-foreground/80">
                      {formatDate(event.start_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[var(--mainBlue)] mt-1" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-foreground/80">
                      {formatTime(event.start_time)}
                      {event.end_time && ` - ${formatTime(event.end_time)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[var(--mainBlue)] mt-1" />
                  <div>
                    <p className="font-semibold">Venue</p>
                    <p className="text-foreground/80">
                      {event.venue || "To be announced"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-[var(--mainBlue)] mt-1" />
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-foreground/80">
                      {event.capacity
                        ? `${event.capacity} attendees`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-card rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">Cancellation Policy</h2>
              <p className="text-foreground/80 text-lg leading-relaxed">
                {event.cancellation_policy ||
                  "No cancellation policy specified for this event."}
              </p>
            </div>
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:col-span-1">
            {event.is_closed ? (
              <div className="sticky top-24 bg-card rounded-xl shadow-md p-8 text-center">
                <p className="text-xl text-muted-foreground">
                  This event is closed. No tickets are available.
                </p>
              </div>
            ) : (
              <div className="sticky top-24 bg-card rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Select Tickets</h2>
                <div className="space-y-5">
                  {event.ticket_types && event.ticket_types.length > 0 ? (
                    <>
                      {event.ticket_types.map((ticket: any) => {
                        const isEligible = ticket.status === "ON_SALE" || !ticket.status;

                        const getStatusColor = (status: string) => {
                          switch (status) {
                            case "ON_SALE": return "bg-green-100 text-green-800 border-green-200";
                            case "SOLD_OUT": return "bg-red-100 text-red-800 border-red-200";
                            case "UPCOMING": return "bg-blue-100 text-blue-800 border-blue-200";
                            case "PAUSED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                            case "ENDED": return "bg-gray-100 text-gray-800 border-gray-200";
                            default: return "bg-muted text-muted-foreground border-border";
                          }
                        };

                        const formatStatusName = (status: string) => {
                          if (!status) return "AVAILABLE";
                          return status.replace("_", " ");
                        };

                        return (
                          <div
                            key={ticket.reference}
                            className={`border border-border rounded-xl p-6 transition-colors ${isEligible
                              ? "hover:border-[var(--mainRed)]/50 cursor-pointer"
                              : "opacity-60 cursor-not-allowed bg-muted/30"
                              }`}
                            onClick={() => {
                              if (isEligible) setShowBookingModal(true);
                            }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-xl font-bold flex items-center gap-3">
                                  {ticket.name}
                                  {ticket.status && ticket.status !== "ON_SALE" && (
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getStatusColor(ticket.status)}`}>
                                      {formatStatusName(ticket.status)}
                                    </span>
                                  )}
                                </h4>
                                <p className="text-3xl font-bold text-[var(--mainRed)] mt-2">
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
                            <div className="flex justify-between items-center mt-3">
                              {ticket.quantity_available !== null ? (
                                ticket.quantity_available <= 10 ? (
                                  <p className="text-orange-600 font-semibold">
                                    Only {ticket.quantity_available} tickets left!
                                  </p>
                                ) : (
                                  <p className="text-muted-foreground">
                                    {ticket.quantity_available} tickets available
                                  </p>
                                )
                              ) : (
                                <p className="text-muted-foreground">
                                  Unlimited tickets
                                </p>
                              )}

                              {/* Show status label explicitly if not active */}
                              {!isEligible && (
                                <p className="text-sm font-medium text-red-600/80">
                                  Currently unavailable for booking
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      <Button
                        onClick={() => setShowBookingModal(true)}
                        disabled={!event.ticket_types.some((t: any) => t.status === "ON_SALE" || !t.status)}
                        className="w-full bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white text-lg py-6 shadow-lg disabled:opacity-50"
                      >
                        {event.ticket_types.some((t: any) => t.status === "ON_SALE" || !t.status)
                          ? "Get Tickets"
                          : "No Tickets Available"}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Secure payment processing
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-lg">
                        No tickets available for this event
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
