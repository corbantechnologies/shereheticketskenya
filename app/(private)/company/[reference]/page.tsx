/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen bg-[var(--background)] font-sans pb-12">
        {/* Header */}
        <div className="bg-white border-b border-[var(--border)] sticky top-0 z-40">
          <div className=" mx-auto px-6 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/organizer/dashboard")}
              className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Companies
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 border-[var(--border)] shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
              Edit Company
            </Button>
          </div>
        </div>

        <div className=" mx-auto p-6 space-y-8">
          {/* Alert */}
          {!hasRequiredDetails && (
            <Alert
              variant="destructive"
              className="bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold ml-2">
                Complete Your Company Profile
              </AlertTitle>
              <AlertDescription className="ml-7 mt-1 text-[#ef4444]">
                Please update your company details (country, city, address, and
                phone) to access the full dashboard and manage events
                effectively.
              </AlertDescription>
            </Alert>
          )}

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-full border-[var(--border)] shadow-sm bg-white overflow-hidden">
                <div className="h-24 bg-[var(--secondary)] border-b border-[var(--border)]" />
                <CardContent className="pt-0 relative">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="-mt-12 ml-4">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-md bg-white"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-[var(--mainRed)] rounded-xl flex items-center justify-center border-4 border-white shadow-md">
                          <span className="text-white text-4xl font-bold">
                            {company.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">
                          {company.name}
                        </h2>
                        <Badge
                          variant="outline"
                          className="text-[var(--muted-foreground)] border-[var(--border)] bg-[var(--background)]"
                        >
                          {company.company_code}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted-foreground)] mt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-[var(--mainBlue)]" />
                          <span>
                            {company.city && company.country
                              ? `${company.city}, ${company.country}`
                              : "Location not set"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-[var(--mainBlue)]" />
                          <span>{company.phone || "Phone not set"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              <Card className="border-[var(--border)] shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                    Total Events
                  </CardTitle>
                  <div className="p-2 bg-[var(--secondary)] rounded-md">
                    <Calendar className="h-4 w-4 text-[var(--mainBlue)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--foreground)]">
                    {events.length}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Managed events
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[var(--border)] shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                    Ticket Types
                  </CardTitle>
                  <div className="p-2 bg-[var(--secondary)] rounded-md">
                    <Ticket className="h-4 w-4 text-[var(--mainRed)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--foreground)]">
                    {totalTicketTypes}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Across all events
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Events
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  Manage and track all events under {company.name}
                </p>
              </div>
              <Button
                onClick={() => router.push("./events/new")}
                disabled={!hasRequiredDetails}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
            </div>

            <Card className="border-[var(--border)] shadow-sm bg-white">
              <CardContent className="p-0">
                {hasRequiredDetails ? (
                  <EventsDisplayTable
                    events={events}
                    companyReference={company.reference}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--secondary)]">
                    <div className="bg-white p-4 rounded-full mb-4 shadow">
                      <AlertCircle className="h-8 w-8 text-[var(--muted-foreground)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                      Events Locked
                    </h3>
                    <p className="text-[var(--muted-foreground)] max-w-sm text-sm">
                      Complete your company profile above to start creating and
                      managing events.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full-Screen Modal on ALL devices */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Solid dark backdrop - NO blur, NO transparency effects */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Full-screen modal panel */}
          <div className="relative flex flex-col w-full h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-white">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  Update Company Details
                </h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Complete your company profile to unlock full dashboard
                  features.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-3 rounded-lg hover:bg-[var(--secondary)] transition"
              >
                <X className="h-5 w-5 text-[var(--muted-foreground)]" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
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
    </>
  );
}
