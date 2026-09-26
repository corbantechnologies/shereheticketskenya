/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchCompanyEvent } from "@/hooks/events/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import EditEvent from "@/forms/events/EditEvent";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StandaloneEditEventPage() {
  const router = useRouter();
  const { reference, event_code } = useParams<{ reference: string; event_code: string }>();
  const { isLoading, data: event, refetch } = useFetchCompanyEvent(event_code);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <p className="text-slate-400">Event not found.</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-cyan-400 hover:underline text-sm block mx-auto"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Command Center</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Event: {event.name}
            </h1>
            <Badge className="bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs">
              {event.event_code}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Update schedule, change venue location, or revise cancellation terms.
          </p>
        </div>
      </div>

      <Card className="border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <EditEvent 
            event={event} 
            refetchEvent={refetch}
            isPage={true} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
