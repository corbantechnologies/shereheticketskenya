"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetchBooking } from "@/hooks/bookings/actions";
import { useFetchEvent } from "@/hooks/events/actions";

import { LoadingSpinner } from "@/components/general/LoadingComponents";
import {
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Download,
  Share2,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function TicketsPage() {
  const router = useRouter();
  const { event_code, booking_reference: reference } = useParams<{
    event_code: string;
    booking_reference: string;
  }>();
  // alias booking_reference to reference

  const {
    isLoading: isLoadingBooking,
    data: booking,
    error,
  } = useFetchBooking(reference);
  const { isLoading: isLoadingEvent, data: event } = useFetchEvent(event_code);

  const isLoading = isLoadingBooking || isLoadingEvent;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("ticket-container");
    if (!element) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `sherehe-tickets-${reference}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Tickets downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download tickets");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Tickets
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find the booking details you&apos;re looking for.
          </p>
          <Button onClick={() => router.push(`/events/${event_code}`)}>
            Back to Event
          </Button>
        </div>
      </div>
    );
  }

  if (booking.payment_status !== "COMPLETED") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-600 mb-2">
            Payment Pending
          </h1>
          <p className="text-gray-600 mb-4">
            Your payment has not been confirmed yet.
          </p>
          <Button
            onClick={() => router.push(`/events/${event_code}/${reference}`)}
          >
            Complete Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. Here are your tickets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Ticket Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div id="ticket-container" className="bg-white">
              <div className="bg-[#045e32] p-6 text-white text-center">
                <h2 className="text-2xl font-bold">
                  {event?.name || booking.event || "Event Name"}
                </h2>
                <p className="opacity-90 mt-1">
                  Present this ticket at the entrance
                </p>
              </div>

              <CardContent className="p-0">
                <div className="p-6 grid gap-6">
                  {booking.tickets && booking.tickets.length > 0 ? (
                    booking.tickets.map((ticket) => (
                      <div
                        key={ticket.ticket_code}
                        className="border rounded-xl overflow-hidden flex flex-col md:flex-row bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Left Side: QR Code Area */}
                        <div className="bg-gray-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-gray-300 min-w-[200px]">
                          <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                            {/* QR Code Placeholder - In real app display actual QR Image */}
                            {ticket.qr_code ? (
                              <img
                                src={ticket.qr_code}
                                alt="Ticket QR"
                                className="w-32 h-32 object-contain"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                No QR Code
                              </div>
                            )}
                          </div>
                          <span className="font-mono text-sm font-bold text-gray-600 tracking-wider">
                            {ticket.ticket_code}
                          </span>
                          <span className="text-xs text-uppercase text-gray-500 mt-1 font-semibold">
                            {ticket.ticket_type}
                          </span>
                        </div>

                        {/* Right Side: Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Attendee
                              </h3>
                              <p className="text-gray-600 flex items-center gap-2">
                                <User className="w-4 h-4" /> {booking.name}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {/* Date & Time - If available in event object, keeping generic for now */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                  Date
                                </h4>
                                <p className="text-gray-800 font-medium flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#045e32]" />
                                  {event?.start_date
                                    ? new Date(
                                      event.start_date,
                                    ).toLocaleDateString()
                                    : "--/--/----"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                  Time
                                </h4>
                                <p className="text-gray-800 font-medium flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#045e32]" />
                                  {event?.start_time
                                    ? new Date(
                                      `1970-01-01T${event.start_time}`,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                    : "--:--"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Location
                              </h4>
                              <p className="text-gray-800 font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#045e32]" />
                                {event?.venue || "Event Location"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Ref: {booking.reference}</span>
                            <span
                              className={
                                ticket.is_used
                                  ? "text-red-500"
                                  : "text-green-600 font-medium"
                              }
                            >
                              {ticket.is_used ? "USED" : "VALID"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No individual tickets found for this booking.
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="w-full sm:w-auto gap-2 bg-[#045e32] hover:bg-[#034625]"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <LoadingSpinner />
                ) : (
                  <><Download className="w-4 h-4" /> Download All Tickets</>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2"
                onClick={() => { }}
              >
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </CardFooter>
          </Card>

          <div className="text-center mt-6">
            <Button
              variant="link"
              onClick={() => router.push(`/events/${event_code}`)}
            >
              Book More Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}