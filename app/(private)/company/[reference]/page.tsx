/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Users,
  AlertCircle,
  Plus,
} from "lucide-react";
import EventsDisplayTable from "@/components/events/EventsDisplayTable";
import UpdateCompany from "@/forms/company/UpdateCompany";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company, refetch } = useFetchCompany(reference);

  if (isLoading) return <DashboardSkeleton />;

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/organizer/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Companies
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Company Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Company Details</DialogTitle>
                <DialogDescription>
                  Complete your company profile to unlock full dashboard
                  features.
                </DialogDescription>
              </DialogHeader>
              <UpdateCompany company={company} refetch={refetch} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Incomplete Profile Alert */}
        {!hasRequiredDetails && (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Complete Your Company Profile</AlertTitle>
            <AlertDescription>
              Please update your company details (country, city, address, and
              phone) to access the full dashboard and manage events effectively.
            </AlertDescription>
          </Alert>
        )}

        {/* Company Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">{company.name}</CardTitle>
                    <CardDescription className="mt-2">
                      Code: {company.company_code}
                    </CardDescription>
                  </div>
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-[var(--mainRed)] rounded-lg flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {company.city && company.country
                      ? `${company.city}, ${company.country}`
                      : "Location not set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{company.phone || "Phone not set"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Events
                </CardTitle>
                <Calendar className="h-5 w-5 text-[var(--mainBlue)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Types
                </CardTitle>
                <Ticket className="h-5 w-5 text-[var(--mainRed)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTicketTypes}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  All events managed under {company.name}
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push("./events/new")}
                disabled={!hasRequiredDetails}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {hasRequiredDetails ? (
              <EventsDisplayTable
                events={events}
                companyReference={company.reference}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Events Locked</h3>
                <p className="text-muted-foreground max-w-md">
                  Complete your company profile to create and manage events.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
