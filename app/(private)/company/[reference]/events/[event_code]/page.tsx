/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/events/[event_code]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchEvent } from "@/hooks/events/actions";
import { closeEvent } from "@/services/events";
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
  Calendar,
  MapPin,
  Ticket,
  Users,
  Edit3,
  XCircle,
  PartyPopper,
  AlertCircle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EventDetailPage() {
  const router = useRouter();
  const { event_code } = useParams<{ event_code: string }>();
  const { isLoading, data: event, refetch } = useFetchEvent(event_code);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const authHeaders = useAxiosAuth();
  const [isClosing, setIsClosing] = useState(false);

  if (isLoading) return <DashboardSkeleton />;

  if (!event) {
    return <div className="p-12 text-center text-2xl">Event not found.</div>;
  }

  const ticketTypes = event.ticket_types || [];
  const totalTicketsSold = ticketTypes.reduce(
    (sum, t) => sum + (t.bookings?.length || 0),
    0
  );

  const handleCloseEvent = async () => {
    try {
      setIsClosing(true);
      await closeEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event closed successfully.");
    } catch (error) {
      console.error("Failed to close event:", error);
      toast.error("Failed to close event. Please try again.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Header with Event Poster/Gradient */}
        <div className="relative h-96 overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover brightness-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--mainBlue)] to-[var(--mainRed)] opacity-90" />
          )}
          <div className="absolute inset-0 bg-black/40" />

          {/* Header Actions */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            >
              ← Back to Events
            </Button>

            <div className="flex gap-3">
              <Button
                size="default"
                onClick={() => setIsEditModalOpen(true)}
                className="shadow-lg bg-green-500 hover:bg-green-600"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Event
              </Button>

              {!event.is_closed && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="default"
                      disabled={isClosing}
                      className="shadow-lg bg-red-500 hover:bg-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isClosing ? "Closing..." : "Close Event"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white text-black">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        close the event &quot;{event.name}&quot;. Ticket sales
                        and bookings will be stopped immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCloseEvent}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Close Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Event Title & Status */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                  {event.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  <Badge
                    variant={event.is_closed ? "destructive" : "default"}
                    className="text-base px-4 py-1"
                  >
                    {event.is_closed ? "Closed" : "Open"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {format(new Date(event.start_date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {event.venue || "Venue TBA"}
                  </div>
                </div>
              </div>

              <PartyPopper className="h-20 w-20 opacity-30 hidden lg:block" />
            </div>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="p-6 space-y-10 -mt-12 relative z-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-none ring-1 ring-black/5 transform hover:-translate-y-1 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ticket Types
                  </p>
                  <Ticket className="h-5 w-5 text-[var(--mainRed)]" />
                </div>
                <div className="text-3xl font-bold">{ticketTypes.length}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none ring-1 ring-black/5 transform hover:-translate-y-1 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Tickets Sold
                  </p>
                  <Users className="h-5 w-5 text-[var(--mainBlue)]" />
                </div>
                <div className="text-3xl font-bold">{totalTicketsSold}</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none ring-1 ring-black/5 transform hover:-translate-y-1 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <AlertCircle className="h-5 w-5 text-[var(--mainBlue)]" />
                </div>
                <Badge
                  variant={event.is_closed ? "destructive" : "default"}
                  className="text-lg"
                >
                  {event.is_closed ? "Closed" : "Active"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none ring-1 ring-black/5 transform hover:-translate-y-1 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Event Code
                  </p>
                  <Ticket className="h-5 w-5 text-[var(--mainRed)]" />
                </div>
                <code className="text-lg font-mono bg-muted px-3 py-1 rounded">
                  {event.event_code}
                </code>
              </CardContent>
            </Card>
          </div>

          {/* Tabs: Overview, Tickets, Bookings, Analytics */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">Ticket Types</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <Card className="shadow-lg border-none ring-1 ring-black/5">
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description || "No description provided yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Date & Time
                      </h4>
                      <p>
                        {format(new Date(event.start_date), "PPP")}
                        {event.end_date &&
                          ` → ${format(new Date(event.end_date), "PPP")}`}
                      </p>
                      {(event.start_time || event.end_time) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.start_time || "TBA"} —{" "}
                          {event.end_time || "TBA"}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Venue
                      </h4>
                      <p>{event.venue || "Venue to be announced"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="mt-8">
              <Card className="shadow-lg border-none ring-1 ring-black/5">
                <CardContent className="pt-6">
                  {ticketTypes.length > 0 ? (
                    <div className="space-y-6">
                      {ticketTypes.map((type) => (
                        <div
                          key={type.ticket_type_code}
                          className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <h4 className="text-xl font-semibold">
                              {type.name}
                            </h4>
                            <p className="text-muted-foreground mt-1">
                              {type.is_limited
                                ? `${type.quantity_available} tickets available`
                                : "Unlimited"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold">
                              KSh {type.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {type.bookings?.length || 0} sold
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-12 text-muted-foreground">
                      No ticket types created yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="mt-8">
              <Card className="shadow-lg border-none ring-1 ring-black/5">
                <CardContent className="pt-12 text-center text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Bookings list coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <Card className="shadow-lg border-none ring-1 ring-black/5">
                <CardContent className="pt-12 text-center text-muted-foreground">
                  <div className="h-16 w-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Ticket className="h-10 w-10" />
                  </div>
                  <p className="text-xl">
                    Sales & analytics dashboard coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Full-Screen Edit Event Modal Placeholder */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsEditModalOpen(false)}
            />

            <div className="relative flex flex-col h-full w-full bg-white">
              <div className="flex items-center justify-between p-6">
                <div>
                  <h2 className="text-3xl font-bold">
                    Edit Event: {event.name}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Update event details, dates, venue, and more.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 rounded-lg hover:bg-muted transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-20 text-center text-muted-foreground">
                <Calendar className="h-20 w-20 mx-auto mb-6 opacity-50" />
                <p className="text-2xl">Event Update Form Coming Soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
