// app/events/[event_code]/book/page.tsx
"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, ShieldCheck, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { useFetchEvent } from "@/hooks/events/actions";
import BookingForm from "@/components/bookings/BookingForm";

function BookingPageContent() {
  const { event_code } = useParams<{ event_code: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTicketType = searchParams.get("ticket") || "";

  const {
    isLoading: isLoadingEvent,
    data: event,
  } = useFetchEvent(event_code);

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-slate-400 mb-4 text-lg">Event not found or no longer active.</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 justify-center mx-auto transition-colors"
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 lg:py-14 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-600/10 via-rose-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Event Card Preview */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-5 shadow-2xl space-y-4">
            {event.image ? (
              <div className="relative aspect-video lg:aspect-square w-full rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                    Official Event
                  </span>
                </div>
              </div>
            ) : null}

            <div>
              <h2 className="text-lg font-bold text-white leading-snug">{event.name}</h2>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{event.venue || "Venue TBA"}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Official Ticket</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant M-Pesa STK Confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 border-b border-slate-800/80 pb-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Select Tickets &amp; Checkout
                </h1>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  Step 1 of 2
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Choose your ticket tier and enter your phone number to receive your entry pass.
              </p>
            </div>

            <BookingForm
              event={event}
              onCancel={() => router.back()}
              initialTicketType={initialTicketType}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Sherehe Tickets Kenya · Official Secured Booking Gateway</p>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <BookingPageContent />
    </React.Suspense>
  );
}
