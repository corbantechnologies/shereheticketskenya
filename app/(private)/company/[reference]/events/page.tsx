/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/events/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Ticket, Users, AlertCircle, X } from "lucide-react";
import EventsDisplayTable from "@/components/events/EventsDisplayTable";
import { useState } from "react";

export default function CompanyEventsPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return <div className="p-8 text-center">Company not found.</div>;
  }

  const events = company.company_events || [];

  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        {/* Page Header */}
        <div className="border-b border-border bg-card">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold">Events</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  All events managed under{" "}
                  <span className="font-semibold">{company.name}</span>
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!hasRequiredDetails}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 shadow-lg"
              >
                <Plus className="mr-2 h-6 w-6" />
                Create New Event
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width Content */}
        <div className="p-6 space-y-10">
          {/* Locked State Alert */}
          {!hasRequiredDetails && (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                  <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Event Creation Locked
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Please complete your company profile (country, city, address,
                  phone) before creating events.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Events Table */}
          <Card className="shadow-lg">
            <CardContent className="p-0">
              {events.length > 0 ? (
                <EventsDisplayTable
                  events={events}
                  companyReference={company.reference}
                />
              ) : (
                <div className="py-20 text-center">
                  <Calendar className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-semibold mb-3">No Events Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-lg">
                    Start planning your first unforgettable sherehe!
                  </p>
                  <Button
                    size="lg"
                    className="mt-8 bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 shadow-lg"
                    onClick={() => setIsCreateModalOpen(true)}
                    disabled={!hasRequiredDetails}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full-Screen Create Event Modal Placeholder */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative flex flex-col h-full w-full bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-3xl font-bold">Create New Event</h2>
                <p className="text-muted-foreground mt-2">
                  Fill in the details to start planning your sherehe.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-3 rounded-lg hover:bg-muted transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body - Placeholder until CreateEvent form is ready */}
            <div className="flex-1 overflow-y-auto p-6 pb-20 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-20 w-20 text-[var(--mainBlue)] mx-auto mb-6 opacity-50" />
                <p className="text-2xl text-muted-foreground">
                  Create Event Form Coming Soon...
                </p>
                <p className="text-muted-foreground mt-4 max-w-md">
                  We&apos;re building a beautiful, full-featured event creation
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
