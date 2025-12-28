// app/(private)/company/[reference]/events/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, AlertCircle } from "lucide-react";
import EventsDisplayTable from "@/components/events/EventsDisplayTable";
import CreateEvent from "@/forms/events/CreateEvent";
import { useState } from "react";

export default function CompanyEventsPage() {
  const { reference } = useParams<{ reference: string }>();
  const {
    isLoading,
    data: company,
    refetch: refetchCompany,
  } = useFetchCompany(reference);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return <div className="p-8 text-center">Company not found.</div>;
  }

  const events = company.company_events || [];

  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  const handleEventCreated = () => {
    refetchCompany();
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm sticky top-0 z-30 border-b">
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

        {/* Content */}
        <div className="p-6 space-y-10">
          {!hasRequiredDetails && (
            <Card className="bg-muted/40 shadow-inner">
              <CardContent className="py-16 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">
                  Event Creation Locked
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Complete your company profile first to create events.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-xl">
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

      {/* Full-Screen Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <CreateEvent
            companyCode={company.company_code}
            closeModal={() => setIsCreateModalOpen(false)}
            refetchEvents={handleEventCreated}
          />
        </div>
      )}
    </>
  );
}
