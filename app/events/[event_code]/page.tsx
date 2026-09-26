/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/general/Footer";
import { useFetchEvent } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ArrowLeft,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Building,
  ArrowRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import toast from "react-hot-toast";

export default function EventDetailPage() {
  const { event_code } = useParams<{ event_code: string }>();
  const router = useRouter();

  const { isLoading: isLoadingEvent, data: event } = useFetchEvent(event_code);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string>("");

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">This event may have been unpublished or removed.</p>
        <Button asChild className="bg-blue-600 text-white">
          <Link href="/events">Explore Other Events</Link>
        </Button>
      </div>
    );
  }

  const eventDate = event.start_date ? new Date(event.start_date) : new Date();
  const daysUntil = differenceInDays(eventDate, new Date());

  const ticketTypes = (event.ticket_types || []).filter(
    (tt: any) => tt.is_active !== false
  );

  const lowestPrice = ticketTypes.length
    ? Math.min(...ticketTypes.map((t: any) => parseFloat(t.price)))
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Check out ${event.name} on Sherehe Tickets!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Navbar />

      {/* Hero Header with Blurred Backdrop Poster */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden border-b border-slate-900">
        {/* Ambient Blur Backdrop */}
        {event.image && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${event.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-6xl">
          {/* Back link & Share button */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 text-xs border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white rounded-xl flex items-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5 text-cyan-400" /> Share Event
            </Button>
          </div>

          {/* Event Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Event Poster (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-rose-950 flex items-center justify-center">
                    <Ticket className="h-16 w-16 text-slate-700" />
                  </div>
                )}

                {/* Countdown chip */}
                {daysUntil >= 0 && (
                  <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1 text-xs font-bold text-cyan-300 shadow-lg">
                    {daysUntil === 0
                      ? "Happening Today!"
                      : daysUntil === 1
                      ? "Tomorrow!"
                      : `In ${daysUntil} Days`}
                  </div>
                )}
              </div>
            </div>

            {/* Event Meta Header (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600/20 text-cyan-300 border-blue-500/30 text-xs px-3 py-0.5">
                  {event.category || "Music & Concerts"}
                </Badge>
                {event.is_closed && (
                  <Badge className="bg-rose-600 text-white text-xs">Event Closed</Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {event.name}
              </h1>

              {event.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {event.description}
                </p>
              )}

              {/* Key Particulars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Date & Time</div>
                    <div className="text-sm font-bold text-white">
                      {format(eventDate, "EEEE, MMMM d, yyyy")}
                    </div>
                    {event.start_time && (
                      <div className="text-xs text-slate-400">
                        {event.start_time.slice(0, 5)}{" "}
                        {event.end_time && `– ${event.end_time.slice(0, 5)}`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Venue & Location</div>
                    <div className="text-sm font-bold text-white truncate max-w-[200px]">
                      {event.venue || "Venue TBA"}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        event.venue || "Nairobi Kenya"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Booking Section */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Event Content, Lineup & Policy (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Event Description & Rich Content */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                About This Event
              </h2>

              {event.content ? (
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                  <RichTextDisplay content={event.content} />
                </div>
              ) : (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {event.description || "No further details provided for this event."}
                </p>
              )}
            </div>

            {/* Refund & Admission Policy */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-3 text-xs text-slate-400">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Admission & Verification Policy
              </h3>
              <p>
                Every ticket is unique and verified upon arrival via camera gate scanner. Once scanned, the QR code cannot be reused. Tickets can be presented on any smartphone or printed.
              </p>
              {event.refund_policy && (
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="font-semibold text-white">Refund Policy:</span>{" "}
                  {typeof event.refund_policy === "string"
                    ? event.refund_policy
                    : JSON.stringify(event.refund_policy)}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Ticket Selection & Booking Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs text-slate-400 font-medium">Tickets available from</div>
                <div className="text-3xl font-black text-white">
                  {lowestPrice > 0 ? `KES ${lowestPrice.toLocaleString()}` : "Free Entry"}
                </div>
              </div>

              {/* Ticket Tier Selector List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Ticket Tier
                </div>

                {ticketTypes.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
                    No active ticket tiers available.
                  </div>
                ) : (
                  ticketTypes.map((tier: any) => {
                    const isSelected = selectedTicketCode === tier.ticket_type_code;
                    const isSoldOut =
                      tier.is_limited &&
                      tier.quantity_available !== null &&
                      tier.quantity_available <= 0;

                    return (
                      <div
                        key={tier.ticket_type_code}
                        onClick={() => !isSoldOut && setSelectedTicketCode(tier.ticket_type_code)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSoldOut
                            ? "opacity-40 cursor-not-allowed border-slate-800 bg-slate-950/40"
                            : isSelected
                            ? "bg-blue-600/15 border-cyan-400 shadow-md shadow-blue-500/10"
                            : "bg-slate-950/60 hover:bg-slate-850 border-slate-800 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm text-white">{tier.name}</div>
                            {tier.description && (
                              <div className="text-xs text-slate-400 mt-0.5">{tier.description}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-base text-cyan-300">
                              KES {parseFloat(tier.price).toLocaleString()}
                            </div>
                            {tier.is_limited && tier.quantity_available !== null && (
                              <div className="text-[10px] text-rose-400 font-semibold">
                                {isSoldOut ? "Sold Out" : `${tier.quantity_available} left`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Book Tickets CTA Button */}
              <Button
                disabled={event.is_closed || ticketTypes.length === 0}
                onClick={() => {
                  const targetTier = selectedTicketCode || ticketTypes[0]?.ticket_type_code || "";
                  router.push(`/events/${event_code}/book?ticket=${targetTier}`);
                }}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <span>Proceed to Book Tickets</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Safe Checkout Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  M-Pesa STK Push
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  Instant QR Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
