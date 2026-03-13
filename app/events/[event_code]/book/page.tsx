// app/events/[event_code]/book/page.tsx
"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { useFetchEvent } from "@/hooks/events/actions";
import BookingForm from "@/components/bookings/BookingForm";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingPage() {
  const { event_code } = useParams<{ event_code: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTicketType = searchParams.get("ticket") || "";


  const {
    isLoading: isLoadingEvent,
    data: event,
  } = useFetchEvent(event_code);

  if (isLoadingEvent) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Event not found</p>
          <button
            onClick={() => router.back()}
            className="text-[var(--mainBlue)] font-medium flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#d5d5d5] py-4 sm:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Event
        </button>

        <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-2xl">
          {/* Header Section */}
          <div className="bg-black/95 text-white p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg border border-white/10"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue || "Venue TBA"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-10">
            <div className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Your Tickets</h2>
              <p className="text-gray-500 mt-1">
                Select your ticket type and fill in your details to secure your spot.
              </p>
            </div>

            <BookingForm 
              event={event} 
              onCancel={() => router.back()}
              initialTicketType={initialTicketType}
            />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sherehe Tickets Kenya. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
