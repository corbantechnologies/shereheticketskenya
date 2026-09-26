"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchBooking } from "@/hooks/bookings/actions";
import { useFetchEvent } from "@/hooks/events/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Download,
  Share2,
  Clock,
  Sparkles,
  Ticket as TicketIcon,
  MessageSquare,
  ShieldCheck,
  CalendarPlus,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TicketsPage() {
  const router = useRouter();
  const { event_code, booking_reference: reference } = useParams<{
    event_code: string;
    booking_reference: string;
  }>();

  const {
    isLoading: isLoadingBooking,
    data: booking,
    error,
  } = useFetchBooking(reference);
  const { isLoading: isLoadingEvent, data: event } = useFetchEvent(event_code);

  const isLoading = isLoadingBooking || isLoadingEvent;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("ticket-container");
    if (!element) return;

    setIsDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const dataUrl = await toPng(element, {
        backgroundColor: "#090d16",
        pixelRatio: 2,
      });

      const pdfWidth = element.offsetWidth;
      const pdfHeight = element.offsetHeight;

      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`sherehe-pass-${reference}.pdf`);

      toast.success("Boarding pass PDF downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF. Please take a screenshot.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Entry Ticket for ${event?.name || "Sherehe Event"}`,
          text: `Here is my confirmed entry pass for ${event?.name || "the event"}:`,
          url: shareUrl,
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Ticket link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const text = encodeURIComponent(
      `🎉 My Official Entry Pass for *${event?.name || "Sherehe Event"}* is confirmed!\n\nView and scan ticket here: ${shareUrl}\n\nPowered by Sherehe Tickets Kenya`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const getGoogleCalendarUrl = () => {
    if (!event) return "#";
    const title = encodeURIComponent(event.name || "Sherehe Event");
    const details = encodeURIComponent(
      `Tickets confirmed! Reference: ${reference}. Venue: ${event.venue || "TBA"}`
    );
    const location = encodeURIComponent(event.venue || "Nairobi, Kenya");

    let dates = "";
    if (event.start_date) {
      const startClean = event.start_date.replace(/-/g, "");
      const endClean = (event.end_date || event.start_date).replace(/-/g, "");
      dates = `${startClean}/${endClean}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl">
          <TicketIcon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Ticket Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">
            We couldn&apos;t load the tickets for reference{" "}
            <span className="font-mono text-emerald-400">{reference}</span>.
          </p>
          <button
            onClick={() => router.push(`/events/${event_code}`)}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition text-sm font-medium"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  if (booking.payment_status !== "COMPLETED" && booking.payment_status !== "CONFIRMED") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold mb-2">Payment Verification Required</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your booking payment is currently pending confirmation from M-Pesa.
          </p>
          <button
            onClick={() => router.push(`/events/${event_code}/${reference}`)}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold rounded-xl transition text-sm"
          >
            Complete Payment Now
          </button>
        </div>
      </div>
    );
  }

  const ticketsList = booking.tickets || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/events/${event_code}`)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Event
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send to WhatsApp</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>M-Pesa Payment Confirmed · Instant Entry Pass</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            You&apos;re Going to {event?.name || "the Event"}!
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Present your verified QR code at the entrance scanner station for immediate admission.
          </p>
        </div>

        {/* ── DIGITAL BOARDING PASS CARDS CONTAINER ── */}
        <div id="ticket-container" className="space-y-6">
          {ticketsList.length > 0 ? (
            ticketsList.map((t, idx) => (
              <div
                key={t.ticket_code}
                className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl"
              >
                {/* Top Notch & Header */}
                <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 p-6 sm:p-8 border-b border-slate-800/90 relative">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500 text-slate-950 shadow-md">
                        {t.ticket_type || "GENERAL ADMISSION"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Pass {idx + 1} of {ticketsList.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.is_used ? "bg-rose-500" : "bg-emerald-400 animate-pulse"
                        }`}
                      />
                      <span
                        className={`font-semibold tracking-wider uppercase text-[11px] ${
                          t.is_used ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {t.is_used ? "SCANNED / USED" : "VERIFIED & ACTIVE"}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 tracking-tight leading-snug">
                    {event?.name || booking.event}
                  </h2>
                </div>

                {/* Perforated Notch Divider on Left and Right */}
                <div className="relative flex items-center justify-between h-6 bg-slate-900 px-4 -my-3 z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 -ml-7 shrink-0" />
                  <div className="flex-1 border-b-2 border-dashed border-slate-800/90 mx-3" />
                  <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 -mr-7 shrink-0" />
                </div>

                {/* Boarding Pass Body: QR Code + Event Details */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Scannable Cloudinary QR */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div className="p-2.5 bg-white rounded-xl shadow-lg border border-slate-200 mb-3">
                      {t.qr_code ? (
                        <img
                          src={t.qr_code.replace("http://", "https://")}
                          alt={`QR for ${t.ticket_code}`}
                          crossOrigin="anonymous"
                          className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                        />
                      ) : (
                        <div className="w-36 h-36 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                          <TicketIcon className="w-8 h-8 text-slate-300" />
                          <span>QR Initializing</span>
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase">
                      {t.ticket_code}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      Show to bouncer at gate
                    </span>
                  </div>

                  {/* Right Column: Key Pass Info */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Attendee Name
                        </span>
                        <p className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{booking.name}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Booking Ref
                        </span>
                        <p className="text-sm sm:text-base font-mono font-bold text-white">
                          {booking.reference}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Event Date
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {event?.start_date
                              ? new Date(event.start_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Date TBA"}
                          </span>
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                          Entry Time
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{event?.start_time || "Doors Open 6:00 PM"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                        Venue Location
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{event?.venue || "Venue Announced on Ticket"}</span>
                      </p>
                    </div>

                    {/* Barcode Strip Graphic */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>SECURE SINGLE-USE GATE ENTRY</span>
                      <span>M-PESA: {booking.mpesa_receipt_number || "VALIDATED"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-400">Tickets are being issued by the gate processor...</p>
            </div>
          )}
        </div>

        {/* ── ACTION CONTROLS ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <LoadingSpinner />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Pass PDF</span>
              </>
            )}
          </button>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <CalendarPlus className="w-4 h-4 text-emerald-400" />
            <span>Add to Calendar</span>
          </a>

          <button
            onClick={handleWhatsAppShare}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 hover:bg-emerald-900/80 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Save to WhatsApp</span>
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed valid ticket issued directly by Sherehe Tickets Kenya</span>
          </p>
          <p>© {new Date().getFullYear()} Sherehe. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}