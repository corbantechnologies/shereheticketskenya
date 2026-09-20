/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/events/[event_code]/[booking_reference]/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Clock,
  CreditCard,
  Mail,
  Phone,
  User,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { useFetchBooking } from "@/hooks/bookings/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { payBookingSTKPush as payBookingService } from "@/services/bookings";

export default function BookingDetailPage() {
  const router = useRouter();
  const { event_code, booking_reference } = useParams<{
    event_code: string;
    booking_reference: string;
  }>();
  const reference = booking_reference;

  const [loading, setLoading] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const {
    isLoading: isLoadingBooking,
    data: booking,
    error: bookingError,
    refetch: refetchBooking,
  } = useFetchBooking(reference);

  const bookingRef = useRef(booking);
  useEffect(() => {
    bookingRef.current = booking;
  }, [booking]);

  useEffect(() => {
    if (!isLoadingBooking) {
      setLoading(false);

      if (["COMPLETED", "CONFIRMED"].includes(booking?.payment_status || "")) {
        toast.success("Payment confirmed! Loading your tickets...");
        router.push(`/events/${event_code}/${reference}/tickets`);
      } else if (booking?.payment_status === "FAILED") {
        toast.error("Previous payment attempt failed. You can retry below.");
      }
    }
  }, [isLoadingBooking, booking, router, reference, event_code]);

  const pollPaymentStatus = async () => {
    setIsPolling(true);
    const maxRetries = 24; // 2 minutes (every 5s)
    let tries = 0;

    const interval = setInterval(async () => {
      tries++;
      try {
        const result = await refetchBooking();
        const latestBooking = result.data;
        const currentStatus = latestBooking?.payment_status;

        if (["COMPLETED", "CONFIRMED"].includes(currentStatus || "")) {
          clearInterval(interval);
          setPaymentMessage("Payment Successful! Generating your boarding pass...");
          toast.success("Payment Received!");
          setTimeout(() => {
            router.push(`/events/${event_code}/${reference}/tickets`);
          }, 1500);
          setIsPolling(false);
        } else if (
          ["FAILED", "CANCELLED", "REVERSED"].includes(currentStatus || "")
        ) {
          clearInterval(interval);
          setPaymentMessage(
            `Payment ${currentStatus ? currentStatus.toLowerCase() : "failed"}. Please try again.`,
          );
          toast.error(`Payment ${currentStatus || "failed"}`);
          setIsPolling(false);
        } else if (tries >= maxRetries) {
          clearInterval(interval);
          setPaymentMessage(
            "Payment verification timed out. If you received your Safaricom M-Pesa SMS, please refresh this page.",
          );
          toast("Verification taking longer than expected...", { icon: "⏳" });
          setIsPolling(false);
        }
      } catch (e) {
        // Continue polling
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const validationSchema = Yup.object().shape({
    phone_number: Yup.string()
      .required("Phone number is required")
      .matches(
        /^(2547|2541)\d{8}$/,
        "Format must be 2547XXXXXXXX or 2541XXXXXXXX",
      ),
  });

  if (isLoadingBooking || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-white shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            We could not find the booking details for reference{" "}
            <span className="font-mono text-emerald-400">{reference}</span>.
          </p>
          <button
            onClick={() => router.push(`/events/${event_code}`)}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition text-sm font-medium"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  const isPending =
    booking.payment_status === "PENDING" || booking.payment_status === "FAILED";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <button
          onClick={() => router.push(`/events/${event_code}`)}
          className="mb-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition font-medium px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Event
        </button>

        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-3 py-1 rounded-full">
            Step 2: Instant M-Pesa Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Complete Your Payment
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            An M-Pesa STK prompt will appear on your phone screen to enter your PIN.
          </p>
        </div>

        {/* 1. Payment Summary Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl p-6 shadow-2xl mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Total Payable</span>
              <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-emerald-400">
                  {booking.currency || "KES"}
                </span>
                <span>{Number(booking.amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block mb-1">Status</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  booking.payment_status === "COMPLETED" ||
                  booking.payment_status === "CONFIRMED"
                    ? "bg-emerald-950/80 border-emerald-600/50 text-emerald-400"
                    : booking.payment_status === "FAILED"
                    ? "bg-rose-950/80 border-rose-600/50 text-rose-400"
                    : "bg-amber-950/80 border-amber-600/50 text-amber-400 animate-pulse"
                }`}
              >
                {booking.payment_status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Booking Ref</span>
              <span className="font-mono font-bold text-white tracking-wider">
                {booking.reference}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Ticket Tier</span>
              <span className="font-semibold text-white">
                {booking.ticket_type_info?.name || booking.ticket_type} (×{booking.quantity})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Attendee</span>
              <span className="text-slate-200">{booking.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Contact Phone</span>
              <span className="font-mono text-slate-200">{booking.phone}</span>
            </div>
          </div>

          {/* Payment Status / Progress Callout */}
          {paymentMessage && (
            <div
              className={`mt-4 p-4 rounded-xl text-xs sm:text-sm text-center border ${
                paymentMessage.includes("Successful")
                  ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
                  : paymentMessage.includes("failed") ||
                    paymentMessage.includes("timed out")
                  ? "bg-rose-950/60 border-rose-800/80 text-rose-300"
                  : "bg-emerald-950/30 border-emerald-700/60 text-emerald-200 animate-pulse"
              }`}
            >
              {paymentMessage}
            </div>
          )}

          {/* STK Push Payment Form */}
          {isPending && !isPolling && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <Formik
                initialValues={{
                  phone_number: booking.phone || "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setPaymentMessage("Dispatching STK Push to your handset...");
                  try {
                    const payload = {
                      phone_number: values.phone_number,
                      booking_code: booking.booking_code,
                    };

                    await payBookingService(payload);
                    setPaymentMessage(
                      `STK Push sent to ${values.phone_number}! Please check your handset and enter your M-Pesa PIN.`,
                    );
                    toast.success("STK Prompt dispatched to phone!");
                    pollPaymentStatus();
                  } catch (error: any) {
                    toast.error("Failed to initiate payment");
                    setPaymentMessage(
                      error.response?.data?.error ||
                        "Failed to trigger STK Push. Please verify your phone number and retry.",
                    );
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>M-Pesa Safaricom Number</span>
                      </label>
                      <Field
                        name="phone_number"
                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="2547XXXXXXXX or 2541XXXXXXXX"
                      />
                      <ErrorMessage
                        name="phone_number"
                        component="p"
                        className="text-rose-400 text-xs mt-1 font-medium"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Ensure this Safaricom SIM card is active and unlocked.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Requesting M-Pesa STK...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay KES {Number(booking.amount).toLocaleString()} via M-Pesa</span>
                        </>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {/* Active Polling Spinner Card */}
          {isPolling && (
            <div className="mt-6 p-6 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="font-semibold text-white text-base">
                Waiting for M-Pesa Confirmation
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check your phone screen for the Safaricom PIN dialog. Once approved, your digital pass will generate automatically.
              </p>
            </div>
          )}
        </div>

        {/* Security & Support Guarantee */}
        <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Encrypted Safaricom Daraja Integration</span>
          </div>
          <span className="text-slate-500 font-mono">Ref: {reference}</span>
        </div>
      </div>
    </div>
  );
}
