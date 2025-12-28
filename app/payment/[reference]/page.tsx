/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/payment/[reference]/page.tsx

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
  XCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/axios";
import LoadingSpinner from "@/components/general/LoadingComponents";
import { useFetchBooking } from "@/hooks/bookings/actions";

function BookingPayment() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const {
    isLoading: isLoadingBooking,
    data: booking,
    error: bookingError,
    refetch: refetchBooking,
  } = useFetchBooking(reference);

  // Use ref to always have the latest booking data inside intervals
  const bookingRef = useRef(booking);
  useEffect(() => {
    bookingRef.current = booking;
  }, [booking]);

  // Initial setup
  useEffect(() => {
    if (!isLoadingBooking) {
      setLoading(false);
      if (booking?.phone && booking?.payment_status === "PENDING") {
        setPhoneNumber(booking.phone);
      }

      // If page is loaded and payment already completed (e.g. user refreshes)
      if (booking?.payment_status === "COMPLETED") {
        toast.success("Payment already completed!");
        router.push(`/payment/${reference}/success`);
      } else if (booking?.payment_status === "FAILED") {
        toast.error("Payment failed previously.");
        router.push(`/payment/${reference}/failure`);
      }
    }
  }, [isLoadingBooking, booking, router, reference]);

  // AUTO-POLLING AFTER STK PUSH — FIXED with ref
  useEffect(() => {
    if (!paymentMessage || !paymentMessage.includes("enter your M-Pesa PIN"))
      return;

    const interval = setInterval(async () => {
      try {
        await refetchBooking();

        const latestBooking = bookingRef.current;

        if (latestBooking?.payment_status === "COMPLETED") {
          clearInterval(interval);
          toast.success("Payment successful! Redirecting to your tickets...");
          router.push(`/payment/${reference}/success`);
        } else if (latestBooking?.payment_status === "FAILED") {
          clearInterval(interval);
          toast.error("Payment failed. Please try again.");
          router.push(`/payment/${reference}/failure`);
        }
        // Else: still pending → continue polling
      } catch (err) {
        console.error("Error during polling:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentMessage, refetchBooking, router, reference]);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^254\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number (e.g., 254712345678)");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentMessage("Sending payment request...");

    try {
      const payload = {
        booking_code: booking?.booking_code,
        phone_number: phoneNumber,
      };

      await apiActions.post("/api/v1/mpesa/pay/", payload);

      setPaymentMessage(
        "Payment request sent! Please complete the transaction on your phone. We'll redirect you automatically when done."
      );
      toast.success("STK Push sent! Check your phone.");
    } catch (error: any) {
      setIsProcessingPayment(false);
      setPaymentMessage("");
      toast.error(
        error.response?.data?.error ||
          "Failed to send payment request. Try again."
      );
    }
  };

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      await refetchBooking();
      const latest = bookingRef.current;

      if (latest?.payment_status === "COMPLETED") {
        toast.success("Payment confirmed!");
        router.push(`/payment/${reference}/success`);
      } else if (latest?.payment_status === "FAILED") {
        toast.error("Payment failed.");
        router.push(`/payment/${reference}/failure`);
      } else {
        alert("Payment still processing... Please wait a little longer.");
      }
    } catch (error: any) {
      toast.error("Failed to check status. Try again.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoadingBooking || loading) {
    return <LoadingSpinner />;
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Booking not found.</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Details
          </h1>
          <p className="text-gray-600">
            Complete your payment to confirm your booking
          </p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Booking Summary
              </h2>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Reference: {booking.reference}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-gray-600">Attendee</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{booking.phone}</p>
                    <p className="text-sm text-gray-600">Phone</p>
                  </div>
                </div>
                {booking.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{booking.email}</p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Ticket Type</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {booking.ticket_type_info.name || booking.ticket_type}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Quantity</p>
                  <p className="text-sm text-gray-600">
                    {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Booked on</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </h2>

          <div className="flex items-center justify-between text-lg mb-6">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-2xl">
              {booking.currency || "KES"} {booking.amount}
            </span>
          </div>

          <div className="flex justify-between text-sm mb-6">
            <span>Payment Status:</span>
            <span
              className={`px-2 py-1 rounded font-medium ${getStatusColor(
                booking.payment_status
              )}`}
            >
              {booking.payment_status}
            </span>
          </div>

          {/* Only show payment form if still PENDING */}
          {booking.payment_status === "PENDING" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="254712345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {paymentMessage && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <p className="text-blue-700 font-medium">{paymentMessage}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Polling every 5 seconds for status...
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment || !phoneNumber}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    "Sending request..."
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay with M-Pesa • KES {booking.amount}
                    </>
                  )}
                </button>

                {paymentMessage && (
                  <button
                    onClick={handleCheckStatus}
                    disabled={isCheckingStatus}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingStatus
                      ? "Checking..."
                      : "Check Payment Status Manually"}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Success Message (when completed) */}
          {booking.payment_status === "COMPLETED" && (
            <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Payment Successful!
              </h3>
              <p className="text-green-700 mb-6">
                Your tickets are confirmed and ready.
              </p>
              <button
                onClick={() => router.push(`/payment/${reference}/success`)}
                className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                View Your Tickets
              </button>
            </div>
          )}

          {/* Failed Message */}
          {booking.payment_status === "FAILED" && (
            <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 mb-2">
                Payment Failed
              </h3>
              <p className="text-red-700 mb-6">
                Please try again or contact support.
              </p>
              <button
                onClick={() => router.push(`/payment/${reference}/failure`)}
                className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPayment;
