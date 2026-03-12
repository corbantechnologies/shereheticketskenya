/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import CreateEvent from "@/forms/events/CreateEvent";
import { useState } from "react";
import Modal from "@/components/ui/modal";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company, refetch } = useFetchCompany(reference);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Company not found.
      </div>
    );
  }

  const events = company.company_events || [];
  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;
  const totalTicketTypes = events.reduce(
    (acc: number, e: any) => acc + (e.ticket_types?.length || 0),
    0
  );

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Company header + overview — unified card */}
        <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
          {/* Top strip: breadcrumb + edit */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <button
              onClick={() => router.push("/organizer/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All companies
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="h-7 text-xs border-gray-200 bg-white hover:bg-gray-50 px-2.5"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <Avatar className="h-14 w-14 rounded-xl shrink-0">
                <AvatarImage src={company.logo || undefined} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-[var(--mainRed)]/10 text-[var(--mainRed)] text-xl font-semibold">
                  {company.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-lg font-semibold text-foreground truncate">{company.name}</h1>
                  <Badge variant="secondary" className="text-xs font-mono shrink-0">
                    {company.company_code}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.city && company.country
                      ? `${company.city}, ${company.country}`
                      : "Location not set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {company.phone || "Phone not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* KPI strip */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Events
                </p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{events.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Ticket className="h-3.5 w-3.5" /> Ticket types
                </p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{totalTicketTypes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incomplete profile alert */}
        {!hasRequiredDetails && (
          <Alert className="border-orange-200 bg-orange-50 text-orange-800 py-3">
            <AlertCircle className="h-4 w-4 !text-orange-600" />
            <AlertDescription className="text-sm">
              <span className="font-medium">Profile incomplete.</span> Add your country, city, address, and phone to unlock event management.
            </AlertDescription>
          </Alert>
        )}

        {/* Events section */}
        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Events</h2>
              <Button
                size="sm"
                onClick={() => setIsCreateEventModalOpen(true)}
                disabled={!hasRequiredDetails}
                className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New event
              </Button>
            </div>

            {hasRequiredDetails ? (
              <EventsDisplayTable
                events={events}
                companyReference={company.reference}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Events locked</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Complete your company profile to unlock event creation and management.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Edit company modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Company Details"
      >
        <UpdateCompany
          company={company}
          refetch={refetch}
          closeDialog={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Create event modal */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
      >
        <CreateEvent
          companyCode={company.company_code}
          closeModal={() => setIsCreateEventModalOpen(false)}
          refetchEvents={refetch}
        />
      </Modal>
    </>
  );
}
