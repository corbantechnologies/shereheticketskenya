/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(private)/company/[reference]/events/[event_code]/edit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompanyEvent } from "@/hooks/events/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import EditEvent from "@/forms/events/EditEvent";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StandaloneEditEventPage() {
  const router = useRouter();
  const { reference, event_code } = useParams<{ reference: string; event_code: string }>();
  const { isLoading, data: event, refetch } = useFetchCompanyEvent(event_code);

  if (isLoading) return <DashboardSkeleton />;

  if (!event) {
    return (
      <div className="mx-auto p-8 text-center">
        <p className="text-muted-foreground">Event not found.</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-[var(--mainBlue)] hover:underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event Details
        </button>
      </div>

      <Card className="border-none shadow-lg bg-white overflow-hidden">
        <CardContent className="p-6">
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
