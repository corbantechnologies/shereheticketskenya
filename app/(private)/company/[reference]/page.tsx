/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import {
  DashboardSkeleton,
  LoadingSpinner,
} from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import EventsDisplayTable from "@/components/events/EventsDisplayTable";
import UpdateCompany from "@/forms/company/UpdateCompany";
import { useState } from "react";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const {
    isLoading: isCompanyLoading,
    data: company,
    refetch,
  } = useFetchCompany(reference);
  const [open, setOpen] = useState(false);

  if (isCompanyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!company) {
    return <div className="p-8 text-center">Company not found.</div>;
  }

  const events = company.company_events || [];

  // Required details check
  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  const totalTicketTypes = events.reduce(
    (acc, e) => acc + (e.ticket_types?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans pb-12">
      {/* Header / Breadcrumb Area */}
      <div className="bg-white border-b border-[var(--border)] sticky top-0 z-10">
        <div className="px-6 h-16 flex items-center justify-between">
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
            className="flex items-center gap-2 border-[var(--border)] shadow-sm"
            onClick={() => setOpen(true)}
          >
            <Edit3 className="h-4 w-4" />
            Edit Company
          </Button>
        </div>
      </div>

      <div className=" mx-auto p-6 space-y-8">
        {/* Incomplete Profile Alert */}
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
              phone) to access the full dashboard and manage events effectively.
            </AlertDescription>
          </Alert>
        )}

        {/* Hero / Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <Card className="h-full border-[var(--border)] shadow-sm bg-white overflow-hidden">
              <div className="h-24 bg-[var(--secondary)]/50 border-b border-[var(--border)] relative">
                {/* Banner Placeholder or real banner could go here */}
              </div>
              <CardContent className="pt-0 relative">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Logo - overlapped */}
                  <div className="-mt-12 ml-4 relative">
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
                        <MapPin className="h-4 w-4 text-[var(--primary)]" />
                        <span>
                          {company.city && company.country
                            ? `${company.city}, ${company.country}`
                            : "Location not set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-[var(--primary)]" />
                        <span>{company.phone || "Phone not set"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <Card className="border-[var(--border)] shadow-sm bg-white flex flex-col justify-center">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                  Total Events
                </CardTitle>
                <div className="p-2 bg-[var(--secondary)] rounded-md">
                  <Calendar className="h-4 w-4 text-[var(--primary)]" />
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

            <Card className="border-[var(--border)] shadow-sm bg-white flex flex-col justify-center">
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
                <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--background)]/50">
                  <div className="bg-[var(--secondary)] p-4 rounded-full mb-4">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[85vw] w-full max-h-[90vh] overflow-y-auto bg-white p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Update Company Details</DialogTitle>
            <DialogDescription>
              Complete your company profile to unlock full dashboard features.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <UpdateCompany
              company={company}
              refetch={refetch}
              closeDialog={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
