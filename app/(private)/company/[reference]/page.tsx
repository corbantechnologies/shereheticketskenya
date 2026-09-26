/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Edit3,
  MapPin,
  Phone,
  Ticket,
  Mail,
  Globe,
  Plus,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import UpdateCompany from "@/forms/company/UpdateCompany";
import Modal from "@/components/ui/modal";
import Link from "next/link";
import { format } from "date-fns";

export default function CompanyDetailPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company, refetch } = useFetchCompany(reference);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const events = company.company_events || [];
  const hasRequiredDetails =
    Boolean(company.country && company.city && company.address && company.phone);
  const totalTicketTypes = events.reduce(
    (acc: number, e: any) => acc + (e.ticket_types?.length || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/organizer/dashboard")}
          className="text-xs text-slate-500 hover:text-slate-900 p-0 h-auto gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Organizations</span>
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-100 gap-1.5 rounded-xl shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>

          <Button
            size="sm"
            onClick={() => router.push(`/company/${reference}/events/create`)}
            className="h-9 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold gap-1.5 rounded-xl shadow-md shadow-cyan-600/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Event</span>
          </Button>
        </div>
      </div>

      {/* Brand Profile Banner Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-3xl overflow-hidden">
        {/* Cover Art Banner */}
        <div className="h-44 sm:h-52 w-full relative bg-gradient-to-r from-blue-100 via-slate-100 to-cyan-100">
          {company.banner && (
            <img
              src={company.banner}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 rounded-2xl border-4 border-white bg-slate-100 shadow-xl shrink-0">
                <AvatarImage src={company.logo || undefined} className="object-cover" />
                <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white text-3xl font-extrabold">
                  {company.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {company.name}
                  </h1>
                  <Badge className="bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs font-semibold">
                    {company.company_code}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  {company.city ? `${company.city}, ${company.country || "Kenya"}` : "Location not set"}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => router.push(`/company/${reference}/events`)}
              className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl self-start sm:self-auto gap-2 shadow-sm"
            >
              <span>Manage Events Hub</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Bio / Description */}
          {company.description && (
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-6">
              {company.description}
            </p>
          )}

          {/* Contact Details & KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5 text-cyan-600" /> Total Events
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{events.length}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Ticket className="h-3.5 w-3.5 text-blue-600" /> Ticket Tiers
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalTicketTypes}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Phone className="h-3.5 w-3.5 text-emerald-600" /> Contact Phone
              </p>
              <p className="text-xs font-mono font-bold text-slate-900 mt-2 truncate">
                {company.phone || "Not configured"}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <Mail className="h-3.5 w-3.5 text-purple-600" /> Official Email
              </p>
              <p className="text-xs font-medium text-slate-900 mt-2 truncate">
                {company.email || "Not configured"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incomplete profile notice */}
      {!hasRequiredDetails && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-amber-900">Brand details incomplete: </span>
            <span>
              Please update your location, phone number, and address so your organization meets verification standards.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0"
          >
            Complete Details
          </Button>
        </div>
      )}

      {/* Events Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Events Hosted by {company.name}</h2>
            <p className="text-xs text-slate-500">All live, draft, and past productions.</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/company/${reference}/events`)}
            className="h-8 text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          >
            View All ({events.length})
          </Button>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map((event: any) => {
              const isClosed = event.is_closed;
              return (
                <Card
                  key={event.reference || event.event_code}
                  className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="h-32 w-full bg-slate-100 relative">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Calendar className="w-8 h-8" />
                      </div>
                    )}
                    <Badge
                      className={`absolute top-2.5 right-2.5 text-[10px] font-bold ${
                        isClosed ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                      }`}
                    >
                      {isClosed ? "CLOSED" : "LIVE"}
                    </Badge>
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{event.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                      {event.start_date ? format(new Date(event.start_date), "dd MMM yyyy") : "TBA"}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="line-clamp-1">{event.venue || "Venue TBA"}</span>
                    </p>
                  </CardContent>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-xs text-cyan-600 hover:text-cyan-700 p-0 h-auto font-medium"
                    >
                      <Link href={`/events/${event.event_code}`} target="_blank">
                        Public Page <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/company/${reference}/events/${event.event_code}`)
                      }
                      className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
                    >
                      Command Center
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl p-8 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No events published for this brand yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first live concert, festival, or meetup to begin taking instant M-Pesa bookings.
            </p>
            <Button
              onClick={() => router.push(`/company/${reference}/events/create`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create Event
            </Button>
          </Card>
        )}
      </div>

      {/* Edit Company Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Organization Profile"
        description="Update your brand identity, contact phone, inquiries email, and location."
      >
        <div className="p-6">
          <UpdateCompany
            company={company}
            refetch={refetch}
            closeDialog={() => setIsEditModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
