/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import CreateEvent from "@/forms/events/CreateEvent";
import { ArrowLeft, Sparkles, Calendar, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";

export default function StandaloneCreateEventPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-400">Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events Hub</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create New Live Event
            </h1>
            <Badge className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold text-xs">
              {company.name}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure your event schedule, venue, promotional imagery, and cancellation policies.
          </p>
        </div>
      </div>

      {/* Creation Studio Container */}
      <Card className="border border-slate-800 bg-white rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <CreateEvent 
            companyCode={company.company_code}
            isPage={true} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
