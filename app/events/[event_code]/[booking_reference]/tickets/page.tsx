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

  const {
    isLoading: isLoadingBooking,
    data: booking,
    error,
  } = useFetchBooking(reference);
  const { isLoading: isLoadingEvent, data: event } = useFetchEvent(event_code);

  const isLoading = isLoadingBooking || isLoadingEvent;

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTicketImage = async (ticketElement: HTMLElement, index: number) => {
    const html2canvas = (await import("html2canvas")).default;
    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      // Better filename — includes ticket type or code
      const ticketIdentifier = ticketElement.dataset.ticketCode || ticketElement.dataset.ticketType || `ticket-${index + 1}`;
      link.download = `sherehe-${reference}-${ticketIdentifier}.png`;
      link.href = dataUrl;
      link.click();

      // Small artificial delay to prevent browser blocking too many downloads
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error("Ticket download failed:", err);
      throw err; // let caller handle
    }
  };

  const handleDownloadAll = async () => {
    if (!booking?.tickets?.length) {
      toast.error("No tickets found");
      return;
    }

    setIsDownloading(true);
    try {
      // Find all ticket wrapper elements
      const ticketElements = document.querySelectorAll<HTMLElement>('[data-ticket-id]');

      if (ticketElements.length === 0) {
        toast.error("Could not find ticket elements in DOM");
        return;
      }

      for (let i = 0; i < ticketElements.length; i++) {
        const el = ticketElements[i];
        await downloadTicketImage(el, i);
      }

      toast.success(`Downloaded ${ticketElements.length} ticket(s)`);
    } catch (error) {
      console.error("Batch download failed:", error);
      toast.error("Failed to download one or more tickets");
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

  // ... error & payment pending checks remain the same ...

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
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-white">
              <div className="bg-[#045e32] p-6 text-white text-center">
                <h2 className="text-2xl font-bold">
                  {event?.name || booking?.event || "Event Name"}
                </h2>
                <p className="opacity-90 mt-1">
                  Present this ticket at the entrance
                </p>
              </div>

              <CardContent className="p-0">
                <div className="p-6 grid gap-6">
                  {booking?.tickets && booking?.tickets.length > 0 ? (
                    booking?.tickets.map((ticket, index) => (
                      <div
                        key={ticket.ticket_code}
                        // Important: unique identifier for querySelectorAll
                        data-ticket-id={ticket.ticket_code}
                        data-ticket-code={ticket.ticket_code}
                        data-ticket-type={ticket.ticket_type?.toLowerCase().replace(/\s+/g, "-")}
                        className="border rounded-xl overflow-hidden flex flex-col md:flex-row bg-white shadow-sm hover:shadow-md transition-shadow ticket-for-download"
                      >
                        {/* Left Side: QR Code Area */}
                        <div className="bg-gray-100 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-gray-300 min-w-[200px]">
                          <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                            {ticket.qr_code ? (
                              <img
                                src={ticket.qr_code}
                                alt="Ticket QR"
                                className="w-32 h-32 object-contain"
                                crossOrigin="anonymous" // helps with CORS if QR is external
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
                          <span className="text-xs uppercase text-gray-500 mt-1 font-semibold">
                            {ticket.ticket_type}
                          </span>
                        </div>

                        {/* Right Side: Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          {/* ... rest of ticket content stays exactly the same ... */}
                          <div className="space-y-4">
                            {/* Attendee, Date, Time, Location ... */}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Ref: {booking?.reference}</span>
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
                      No individual tickets found for this booking?.
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            <CardFooter className="bg-gray-50 p-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="w-full sm:w-auto gap-2 bg-[#045e32] hover:bg-[#034625]"
                onClick={handleDownloadAll}
                disabled={isDownloading || !booking?.tickets?.length}
              >
                {isDownloading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download All Tickets
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2"
                onClick={() => {}}
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