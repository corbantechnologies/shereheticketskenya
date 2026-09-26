"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiActions } from "@/tools/axios";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TicketData {
  reference: string;
  ticket_code: string;
  qr_code?: string;
  is_used: boolean;
  booking_info?: {
    name: string;
    event?: string;
    event_code?: string;
    ticket_type_name?: string;
    reference?: string;
    status?: string;
  };
}

export default function TicketDirectResolverPage() {
  const { reference } = useParams<{ reference: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;

    const resolveTicket = async () => {
      try {
        setLoading(true);
        const res = await apiActions.get(`/api/v1/tickets/${reference}/`);
        const data: TicketData = res.data;
        setTicket(data);

        // If event_code and booking reference are present, seamlessly redirect to the full boarding pass
        if (data.booking_info?.event_code && data.booking_info?.reference) {
          router.replace(
            `/events/${data.booking_info.event_code}/${data.booking_info.reference}/tickets`
          );
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        setLoading(false);
        setError(
          err.response?.data?.detail ||
            "Ticket pass not found or reference has expired."
        );
      }
    };

    resolveTicket();
  }, [reference, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <p className="text-xs text-slate-400 mt-3 font-medium animate-pulse">
          Verifying Sherehe digital pass...
        </p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Invalid or Unrecognized Pass</h1>
          <p className="text-xs text-slate-400">{error || "Ticket pass could not be resolved."}</p>
          <Button
            asChild
            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs h-10 font-semibold"
          >
            <Link href="/">Return to Sherehe Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Verified Ticket</span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {ticket.booking_info?.event || "Sherehe Event Pass"}
          </h2>
          <p className="text-xs text-cyan-400 font-medium mt-0.5">
            {ticket.booking_info?.ticket_type_name || "General Admission"}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
          {ticket.qr_code ? (
            <img
              src={ticket.qr_code}
              alt="Ticket QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <QrCode className="w-24 h-24 text-slate-400" />
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          {ticket.is_used ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" /> Already Checked In
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid For Entry
            </span>
          )}
        </div>

        <div className="text-left text-xs bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Attendee:</span>
            <span className="text-slate-200 font-semibold">{ticket.booking_info?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Ticket Code:</span>
            <span className="font-mono text-cyan-400 font-bold">{ticket.ticket_code}</span>
          </div>
        </div>

        {ticket.booking_info?.event_code && ticket.booking_info?.reference && (
          <Button
            onClick={() =>
              router.push(
                `/events/${ticket.booking_info?.event_code}/${ticket.booking_info?.reference}/tickets`
              )
            }
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <span>Open Full Boarding Pass</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
