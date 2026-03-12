/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/events/[event_code]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompanyEvent } from "@/hooks/events/actions";
import { closeEvent, publishEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Ticket,
  Calendar,
  XCircle,
  Globe,
  MapPin,
  Users,
  Eye,
  Clock,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import CreateTicketType from "@/forms/tickettypes/CreateTicketType";
import EditEvent from "@/forms/events/EditEvent";
import EditTicketType from "@/forms/tickettypes/EditTicketType";
import EventBookingsTable from "@/components/events/EventBookingsTable";
import CreateCoupon from "@/forms/coupons/CreateCoupon";
import UpdateCoupon from "@/forms/coupons/UpdateCoupon";
import Modal from "@/components/ui/modal";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

export default function EventDetailPage() {
  const router = useRouter();
  const { reference, event_code } = useParams<{ reference: string; event_code: string }>();
  const { isLoading, data: event, refetch } = useFetchCompanyEvent(event_code);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [isEditCouponModalOpen, setIsEditCouponModalOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<any>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const authHeaders = useAxiosAuth();
  const [isClosing, setIsClosing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!event) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Event not found.</div>;
  }

  const coupons = event.coupons || [];
  const ticketTypes = event.ticket_types || [];
  const totalTicketsSold = event.tickets_sold ?? 0;

  const allBookings = ticketTypes
    .flatMap((type: any) =>
      (type.bookings || []).map((booking: any) => ({
        ...booking,
        ticket_type_info: {
          name: type.name,
          price: type.price,
          ticket_type_code: type.ticket_type_code,
        },
      }))
    )
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleCloseEvent = async () => {
    try {
      setIsClosing(true);
      await closeEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event closed successfully.");
    } catch {
      toast.error("Failed to close event. Please try again.");
    } finally {
      setIsClosing(false);
    }
  };

  const handlePublishEvent = async () => {
    try {
      setIsPublishing(true);
      await publishEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event published successfully.");
    } catch {
      toast.error("Failed to publish event. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const statusLabel = event.is_closed ? "Closed" : event.is_published ? "Published" : "Draft";
  const statusClass = event.is_closed
    ? "bg-gray-100 text-gray-500 border-gray-200"
    : event.is_published
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* ── Event header card ───────────────────────────────────────── */}
        <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
          {/* Top strip: breadcrumb + actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <button
              onClick={() => router.push(`/company/${reference}/events`)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to events
            </button>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Preview — always */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/events/${event.event_code}`, "_blank")}
                className="h-7 text-xs border-gray-200 bg-white hover:bg-gray-50 px-2.5"
              >
                <Eye className="h-3 w-3 mr-1" /> Preview
              </Button>

              {!event.is_closed && (
                <>
                  {/* Edit */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-7 text-xs border-gray-200 bg-white hover:bg-gray-50 px-2.5"
                  >
                    <Edit3 className="h-3 w-3 mr-1" /> Edit
                  </Button>

                  {/* Publish */}
                  {!event.is_published && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          disabled={isPublishing}
                          className="h-7 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white px-2.5"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {isPublishing ? "Publishing…" : "Publish"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white text-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Publish this event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            &quot;{event.name}&quot; will be visible on the platform. You can unpublish it later via Edit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handlePublishEvent}
                            className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90"
                          >
                            Yes, publish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Close */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isClosing}
                        className="h-7 text-xs border-gray-200 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 px-2.5"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        {isClosing ? "Closing…" : "Close event"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white text-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close this event?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This cannot be undone. Ticket sales for &quot;{event.name}&quot; will stop immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCloseEvent}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, close event
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          {/* Event identity */}
          <CardContent className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h1 className="text-lg font-semibold text-foreground">{event.name}</h1>
              <Badge className={`text-xs px-2 py-0.5 border ${statusClass}`}>
                {statusLabel}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(event.start_date), "dd MMM yyyy")}
                {event.end_date && ` → ${format(new Date(event.end_date), "dd MMM yyyy")}`}
              </span>
              {(event.start_time || event.end_time) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {event.start_time || "TBA"} – {event.end_time || "TBA"}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue || "Venue TBA"}
              </span>
            </div>

            {/* KPI strip */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
              <div className="pr-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Ticket className="h-3.5 w-3.5" /> Ticket types
                </p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{ticketTypes.length}</p>
              </div>
              <div className="px-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Tickets sold
                </p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{totalTicketsSold}</p>
              </div>
              <div className="pl-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Code
                </p>
                <p className="text-sm font-mono text-foreground mt-1">{event.event_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-10 bg-white shadow-lg border-none p-1 w-full grid grid-cols-4 rounded-lg">
            <TabsTrigger
              value="overview"
              className="h-8 text-xs data-[state=active]:bg-[var(--mainBlue)] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="h-8 text-xs data-[state=active]:bg-[var(--mainRed)] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
            >
              Ticket types
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="h-8 text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
            >
              Bookings
              {allBookings.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                  {allBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="coupons"
              className="h-8 text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
            >
              Coupons
            </TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="mt-3">
            <Card className="py-0 border-none shadow-lg bg-white">
              <CardContent className="p-4 space-y-4">
                {/* Description lead */}
                {event.description && (
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Rich text body */}
                <RichTextDisplay content={event.content} />

                {/* Date / Venue detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Date &amp; time
                    </p>
                    <p className="text-sm">
                      {format(new Date(event.start_date), "PPP")}
                      {event.end_date && ` → ${format(new Date(event.end_date), "PPP")}`}
                    </p>
                    {(event.start_time || event.end_time) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.start_time || "TBA"} – {event.end_time || "TBA"}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> Venue
                    </p>
                    <p className="text-sm">{event.venue || "To be announced"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Ticket types ── */}
          <TabsContent value="tickets" className="mt-3">
            <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Ticket types</h2>
                  {!event.is_closed && (
                    <Button
                      size="sm"
                      onClick={() => setIsCreateTicketModalOpen(true)}
                      className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add type
                    </Button>
                  )}
                </div>

                {ticketTypes.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/40 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Name</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Price</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Available</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Sold</th>
                          <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {ticketTypes.map((type: any) => (
                          <tr key={type.ticket_type_code} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground text-sm">{type.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{type.ticket_type_code}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground hidden sm:table-cell">
                              KSh {Number(type.price).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                              {type.is_limited
                                ? `${type.quantity_available?.toLocaleString()} left`
                                : "Unlimited"}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                              {type.tickets_sold ?? 0}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {!event.is_closed && (
                                <button
                                  className="inline-flex items-center gap-1 text-xs text-[var(--mainBlue)] hover:underline"
                                  onClick={() => {
                                    setSelectedTicketType(type);
                                    setIsEditTicketModalOpen(true);
                                  }}
                                >
                                  <Edit3 className="h-3 w-3" /> Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Ticket className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No ticket types yet</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Add ticket types so attendees can book.
                    </p>
                    {!event.is_closed && (
                      <Button
                        size="sm"
                        onClick={() => setIsCreateTicketModalOpen(true)}
                        className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add ticket type
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Bookings ── */}
          <TabsContent value="bookings" className="mt-3">
            <Card className="py-0 border-none shadow-lg bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Bookings</h2>
                  <span className="text-xs text-muted-foreground">{allBookings.length} total</span>
                </div>
                <EventBookingsTable bookings={allBookings} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Coupons ── */}
          <TabsContent value="coupons" className="mt-3">
            <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Coupons</h2>
                  {!event.is_closed && (
                    <Button
                      size="sm"
                      onClick={() => setIsCreateCouponModalOpen(true)}
                      className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add coupon
                    </Button>
                  )}
                </div>

                {coupons.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/40 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Code</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Discount</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden md:table-cell">Valid</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Usage</th>
                          <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                          <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {coupons.map((coupon: any) => (
                          <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-mono text-sm font-medium text-foreground">{coupon.code}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground hidden sm:table-cell">
                              {coupon.discount_type === "FIXED"
                                ? `KSh ${coupon.discount_value} OFF`
                                : `${coupon.discount_value}% OFF`}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                              {format(new Date(coupon.valid_from), "dd MMM")} – {format(new Date(coupon.valid_to), "dd MMM yyyy")}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                              {coupon.usage_count} / {coupon.usage_limit ?? "∞"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={`text-xs px-2 py-0.5 border ${
                                  coupon.is_active
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-500 border-gray-200"
                                }`}
                              >
                                {coupon.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {!event.is_closed && (
                                <button
                                  className="inline-flex items-center gap-1 text-xs text-[var(--mainBlue)] hover:underline"
                                  onClick={() => {
                                    setSelectedCoupon(coupon);
                                    setIsEditCouponModalOpen(true);
                                  }}
                                >
                                  <Edit3 className="h-3 w-3" /> Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No coupons yet</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Create discount codes for your attendees.
                    </p>
                    {!event.is_closed && (
                      <Button
                        size="sm"
                        onClick={() => setIsCreateCouponModalOpen(true)}
                        className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add coupon
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditEvent
          event={event}
          closeModal={() => setIsEditModalOpen(false)}
          refetchEvent={refetch}
        />
      </Modal>

      <Modal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        title="Add ticket type"
      >
        <CreateTicketType
          event={event}
          closeModal={() => setIsCreateTicketModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      <Modal
        isOpen={isEditTicketModalOpen && !!selectedTicketType}
        onClose={() => setIsEditTicketModalOpen(false)}
        title="Edit ticket type"
      >
        {selectedTicketType && (
          <EditTicketType
            ticketType={selectedTicketType}
            event={event}
            closeModal={() => setIsEditTicketModalOpen(false)}
            refetch={refetch}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCreateCouponModalOpen}
        onClose={() => setIsCreateCouponModalOpen(false)}
        title="Add coupon"
      >
        <CreateCoupon
          event={event}
          closeModal={() => setIsCreateCouponModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      <Modal
        isOpen={isEditCouponModalOpen && !!selectedCoupon}
        onClose={() => setIsEditCouponModalOpen(false)}
        title="Edit coupon"
      >
        {selectedCoupon && (
          <UpdateCoupon
            coupon={selectedCoupon}
            event={event}
            closeModal={() => setIsEditCouponModalOpen(false)}
            refetch={refetch}
          />
        )}
      </Modal>
    </>
  );
}
