/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  MapPin,
  Phone,
  Ticket,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import EventsDisplayTable from "@/components/events/EventsDisplayTable";
import UpdateCompany from "@/forms/company/UpdateCompany";
import { useState } from "react";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company, refetch } = useFetchCompany(reference);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return <div className="p-8 text-center">Company not found.</div>;
  }

  const events = company.company_events || [];

  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  const totalTicketTypes = events.reduce(
    (acc, e) => acc + (e.ticket_types?.length || 0),
    0
  );

  return (
    <>
      <div className="min-h-screen bg-background pb-6">
        {/* Sticky Header */}
        <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="px-6 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/organizer/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Company
            </Button>
          </div>
        </div>

        {/* Full-width Content */}
        <div className="p-6 space-y-10">
          {/* Incomplete Profile Alert */}
          {!hasRequiredDetails && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Complete Your Company Profile</AlertTitle>
              <AlertDescription>
                Please update your company details (country, city, address, and
                phone) to access the full dashboard and manage events
                effectively.
              </AlertDescription>
            </Alert>
          )}

          {/* Hero / Company Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Company Card */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-lg">
                {/* Banner area - with blur for readability */}
                <div className="relative h-48">
                  {company.banner ? (
                    <img
                      src={company.banner}
                      alt="Company banner"
                      className="w-full h-full object-cover brightness-50 blur-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--mainBlue)] to-[var(--mainBlue)]/80" />
                  )}
                  {/* Overlay for better text contrast if needed */}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <CardContent className="relative -mt-16 px-8 pb-8">
                  <div className="flex flex-col sm:flex-row gap-8">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-32 h-32 rounded-2xl object-cover border-8 border-background shadow-2xl"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-[var(--mainRed)] rounded-2xl flex items-center justify-center border-8 border-background shadow-2xl">
                          <span className="text-white text-5xl font-bold">
                            {company.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Company Name + Details directly under/beside logo */}
                    <div className="flex-1 flex flex-col justify-end">
                      <h1 className="text-4xl font-bold text-foreground">
                        {company.name}
                      </h1>
                      <Badge
                        variant="secondary"
                        className="mt-3 text-base px-4 py-1 w-fit"
                      >
                        {company.company_code}
                      </Badge>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-[var(--mainBlue)]" />
                          <span className="text-base">
                            {company.city && company.country
                              ? `${company.city}, ${company.country}`
                              : "Location not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-[var(--mainBlue)]" />
                          <span className="text-base">
                            {company.phone || "Phone not set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Events
                    </CardTitle>
                    <Calendar className="h-6 w-6 text-[var(--mainBlue)]" />
                  </div>
                  <div className="text-4xl font-bold">{events.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active & upcoming
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-sm font-medium">
                      Ticket Types
                    </CardTitle>
                    <Ticket className="h-6 w-6 text-[var(--mainRed)]" />
                  </div>
                  <div className="text-4xl font-bold">{totalTicketTypes}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Across all events
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Events</h2>
                <p className="text-muted-foreground mt-1">
                  All events managed under {company.name}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push("./events/new")}
                disabled={!hasRequiredDetails}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Event
              </Button>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                {hasRequiredDetails ? (
                  <EventsDisplayTable
                    events={events}
                    companyReference={company.reference}
                  />
                ) : (
                  <div className="py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">
                      Events Locked
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Complete your company profile to unlock event creation and
                      management.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-Screen Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsEditModalOpen(false)}
            />

            <div className="relative flex flex-col h-full w-full bg-white">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-3xl font-bold">Update Company Details</h2>
                  <p className="text-muted-foreground mt-2">
                    Complete your company profile to unlock full dashboard
                    features.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 rounded-lg hover:bg-muted transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-20">
                <UpdateCompany
                  company={company}
                  refetch={() => {
                    refetch();
                    setIsEditModalOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
