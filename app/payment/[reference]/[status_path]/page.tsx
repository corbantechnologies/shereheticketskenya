/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/payment/[reference]/[status]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Ticket as TicketIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/axios";
import LoadingSpinner from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";

interface Ticket {
  reference: string;
  qr_code?: string;
}

interface Booking {
  reference: string;
  name: string;
  email?: string;
  phone: string;
  quantity: number;
  amount: string;
  currency: string;
  payment_status: string;
  payment_date?: string;
  mpesa_receipt_number?: string;
  event?: string;
  ticket_type_info?: {
    name: string;
  };
  ticket_type?: string;
}

export default function BookingPaymentStatusPage() {
  const router = useRouter();
  const { reference, status } = useParams<{
    reference: string;
    status: string;
  }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!reference) return;

      try {
        // Fetch booking details
        const bookingResponse = await apiActions.get(
          `/api/v1/bookings/${reference}/`
        );
        const bookingData = bookingResponse.data;
        setBooking(bookingData);

        // Fetch associated tickets
        const ticketsResponse = await apiActions.get(
          `/api/v1/tickets/?booking_reference=${reference}`
        );
        setTickets(ticketsResponse.data || []);

        setLoading(false);

        // Show toast based on payment status
        const paymentStatus = bookingData.payment_status.toUpperCase();
        if (paymentStatus === "COMPLETED") {
          toast.success("Payment successful! Your tickets are ready.");
        } else if (["FAILED", "REVERSED"].includes(paymentStatus)) {
          toast.error("Payment failed. Please try again or contact support.");
        } else if (paymentStatus === "PENDING") {
          toast.error("Payment is still pending. Please check back soon.");
        } else {
          toast.error("Unknown payment status. Contact support.");
        }
      } catch (error: any) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details. Please try again.");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn&#39;t find a booking with this reference.
          </p>
          <Button
            onClick={() => router.push("/events")}
            className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const isSuccess = booking.payment_status.toUpperCase() === "COMPLETED";

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/events")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Events
        </button>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-xl p-10">
          {/* Success/Failure Header */}
          <div className="flex items-center gap-6 mb-10">
            {isSuccess ? (
              <CheckCircle className="w-20 h-20 text-green-600" />
            ) : (
              <XCircle className="w-20 h-20 text-destructive" />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isSuccess ? "Payment Successful!" : "Payment Failed"}
              </h1>
              <p className="text-xl text-muted-foreground">
                {isSuccess
                  ? "Your tickets have been confirmed and are ready to use."
                  : "We were unable to process your payment."}
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TicketIcon className="h-5 w-5 text-[var(--mainBlue)]" />
                Booking Details
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Reference:</strong>{" "}
                  <span className="font-mono">{booking.reference}</span>
                </p>
                <p>
                  <strong>Event:</strong> {booking.event || "N/A"}
                </p>
                <p>
                  <strong>Ticket Type:</strong>{" "}
                  {booking.ticket_type_info?.name ||
                    booking.ticket_type ||
                    "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong> {booking.quantity} ticket
                  {booking.quantity > 1 ? "s" : ""}
                </p>
                <p>
                  <strong>Total Paid:</strong>{" "}
                  <span className="text-2xl font-bold text-foreground">
                    {booking.currency || "KES"}{" "}
                    {parseFloat(booking.amount).toLocaleString()}
                  </span>
                </p>
                {booking.mpesa_receipt_number && (
                  <p>
                    <strong>M-Pesa Receipt:</strong>{" "}
                    <span className="font-mono">
                      {booking.mpesa_receipt_number}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attendee Information</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Name:</strong> {booking.name}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.phone}
                </p>
                {booking.email && (
                  <p>
                    <strong>Email:</strong> {booking.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tickets Section - Only on Success */}
          {isSuccess && tickets.length > 0 && (
            <div className="border-t pt-10">
              <h3 className="text-2xl font-bold mb-8 text-center">
                Your Tickets ({tickets.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.reference}
                    className="bg-muted/30 border border-border rounded-2xl p-8 text-center shadow-md"
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Ticket Reference
                    </p>
                    <p className="font-mono text-lg font-bold mb-6">
                      {ticket.reference}
                    </p>

                    {ticket.qr_code ? (
                      <img
                        src={ticket.qr_code}
                        alt={`QR Code for ticket ${ticket.reference}`}
                        className="w-64 h-64 mx-auto rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center">
                        <TicketIcon className="h-20 w-20 text-muted-foreground" />
                      </div>
                    )}

                    <p className="mt-6 text-sm text-muted-foreground">
                      Present this QR code at the venue entrance
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Message */}
          <div className="mt-12 text-center">
            {isSuccess ? (
              <p className="text-lg text-muted-foreground">
                Your tickets have been sent to{" "}
                <strong>{booking.email || "your registered phone"}</strong>.
                Check your email or SMS for a copy.
              </p>
            ) : (
              <p className="text-lg text-muted-foreground">
                Please try booking again or contact support at{" "}
                <a
                  href="mailto:support@sherehe.co.ke"
                  className="text-[var(--mainBlue)] underline"
                >
                  support@sherehe.co.ke
                </a>
                .
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={() => router.push("/events")}
              className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 px-10"
            >
              Browse More Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
