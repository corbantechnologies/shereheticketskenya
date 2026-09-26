// components/bookings/BookingForm.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/axios";
import { CouponValidationResponse, validateCoupon } from "@/services/coupons";
import { Loader2, CheckCircle2, Ticket, Sparkles, Tag, ArrowRight, Lock } from "lucide-react";
import { AxiosError } from "axios";

interface TicketType {
  name: string;
  price: string;
  quantity_available: number;
  is_limited: boolean;
  ticket_type_code: string;
  reference: string;
  status?: string;
}

interface Event {
  reference: string;
  event_code: string;
  name: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  company: string;
  created_at: string;
  updated_at: string;
  refund_policy: string;
  capacity: number;
  is_closed: boolean;

  ticket_types: {
    name: string;
    price: string;
    quantity_available: number;
    is_limited: boolean;
    ticket_type_code: string;
    reference: string;
    bookings: string[];
    status?: string;
  }[];
}

interface BookingFormProps {
  event: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialTicketType?: string;
}

const validationSchema = Yup.object({
  ticket_type: Yup.string().required("Please choose a ticket tier"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Please enter quantity")
    .test(
      "quantity-available",
      "Quantity exceeds available tickets",
      function (value) {
        const ticketType = this.parent.ticket_type;
        const ticket = this.options.context?.ticket_types?.find(
          (t: TicketType) => t.ticket_type_code === ticketType,
        );
        return (
          !ticket?.quantity_available || value! <= ticket.quantity_available
        );
      },
    ),
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string().required("Phone number is required"),
  coupon: Yup.string().optional(),
});

export default function BookingForm({
  event,
  onSuccess,
  onCancel,
  initialTicketType,
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCoupon, setValidatedCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const router = useRouter();

  const availableTickets = event.ticket_types.filter((ticket) => {
    if (ticket.status) {
      return ticket.status === "ON_SALE";
    }
    return ticket.quantity_available === null || ticket.quantity_available > 0;
  });

  if (availableTickets.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <Ticket className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <p className="text-lg text-rose-400 font-semibold mb-2">
          Sold Out or Unavailable
        </p>
        <p className="text-sm text-slate-400 mb-6">
          Tickets are currently not available for this event.
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            Return to Event
          </button>
        )}
      </div>
    );
  }

  const defaultTicketType =
    initialTicketType &&
    event.ticket_types.some((t) => t.ticket_type_code === initialTicketType)
      ? initialTicketType
      : availableTickets[0]?.ticket_type_code || "";

  return (
    <Formik
      initialValues={{
        ticket_type: defaultTicketType,
        quantity: 1,
        name: "",
        email: "",
        phone: "",
        coupon: "",
      }}
      validationSchema={validationSchema}
      context={{ ticket_types: event.ticket_types }}
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("ticket_type", values.ticket_type);
          formData.append("quantity", values.quantity.toString());
          formData.append("name", values.name);
          formData.append("email", values.email);
          formData.append("phone", values.phone);
          if (values.coupon) {
            formData.append("coupon", values.coupon);
          }

          const response = await apiActions.post(
            `/api/v1/bookings/create/event/`,
            formData,
          );

          if (onSuccess) {
            onSuccess();
          } else {
            router.push(
              `/events/${event.event_code}/${response?.data?.reference}`,
            );
          }
        } catch (error) {
          toast.error("Error making booking. Please try again.");
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => {
        const selectedTicket = event.ticket_types.find(
          (t) => t.ticket_type_code === values.ticket_type,
        );
        const maxQuantity = selectedTicket?.quantity_available || 10;

        const handleValidateCoupon = async () => {
          if (!values.coupon) {
            setCouponError("Please enter a coupon code");
            return;
          }

          setIsValidating(true);
          setCouponError(null);
          setValidatedCoupon(null);

          try {
            const coupon = await validateCoupon({
              code: values.coupon,
              event_code: event.event_code,
              ticket_type_code: values.ticket_type || "",
            });

            setValidatedCoupon(coupon);
            toast.success("Coupon applied successfully!");
          } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            setCouponError(
              err.response?.data?.error ||
                "Invalid coupon code. Please try again.",
            );
            setValidatedCoupon(null);
          } finally {
            setIsValidating(false);
          }
        };

        // Calculate Totals
        const subTotal =
          selectedTicket && values.quantity > 0
            ? parseFloat(selectedTicket.price) * values.quantity
            : 0;

        let discountAmount = 0;
        if (validatedCoupon && subTotal > 0) {
          const discountValue = validatedCoupon.discount_value;
          const type = validatedCoupon.discount_type.toUpperCase();
          if (type === "FIXED") {
            discountAmount = discountValue * values.quantity;
          } else if (type === "PERCENTAGE") {
            discountAmount = (subTotal * discountValue) / 100;
          }
        }

        discountAmount = Math.min(discountAmount, subTotal);
        const total = Math.max(0, subTotal - discountAmount);

        return (
          <Form className="space-y-6">
            {/* 1. Ticket Tier Interactive Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-200">
                  Select Ticket Tier
                </label>
                <span className="text-xs text-slate-400">
                  {event.ticket_types.length} options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.ticket_types.map((ticket) => {
                  const isSelected = values.ticket_type === ticket.ticket_type_code;
                  const isSoldOut =
                    (ticket.status && ticket.status !== "ON_SALE") ||
                    (!ticket.status &&
                      ticket.quantity_available !== null &&
                      ticket.quantity_available <= 0);

                  const discountedPrice = validatedCoupon?.valid_tickets?.find(
                    (vt) => vt.ticket_type_code === ticket.ticket_type_code,
                  )?.discounted_price;

                  return (
                    <div
                      key={ticket.reference}
                      onClick={() => {
                        if (!isSoldOut) {
                          setFieldValue("ticket_type", ticket.ticket_type_code);
                        }
                      }}
                      className={`relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
                        isSoldOut
                          ? "opacity-50 border-slate-800 bg-slate-900/30 cursor-not-allowed"
                          : isSelected
                          ? "border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50"
                          : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {ticket.name}
                          </p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-lg font-bold text-emerald-400">
                              KES{" "}
                              {discountedPrice
                                ? discountedPrice.toLocaleString()
                                : parseFloat(ticket.price).toLocaleString()}
                            </span>
                            {discountedPrice && (
                              <span className="text-xs line-through text-slate-500">
                                KES {parseFloat(ticket.price).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                        <span>
                          {ticket.quantity_available !== null
                            ? `${ticket.quantity_available} left`
                            : "Available"}
                        </span>
                        {isSoldOut ? (
                          <span className="text-rose-400 font-medium">Sold Out</span>
                        ) : (
                          <span className="text-emerald-400/80 font-medium">Instant Entry</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <ErrorMessage
                name="ticket_type"
                component="p"
                className="text-rose-400 text-xs mt-1.5 font-medium"
              />
            </div>

            {/* 2. Quantity Counter */}
            {values.ticket_type && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div>
                  <label className="block text-sm font-semibold text-slate-200">
                    Number of Tickets
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Max {Math.min(maxQuantity, 10)} per checkout
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue("quantity", Math.max(1, values.quantity - 1))
                    }
                    className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-lg font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={values.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-bold text-white">
                    {values.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue(
                        "quantity",
                        Math.min(maxQuantity, Math.min(10, values.quantity + 1)),
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-lg font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={values.quantity >= Math.min(maxQuantity, 10)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* 3. Promo / Coupon Code Input */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Have a Promo / Referral Code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Field
                    name="coupon"
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-950/70 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      couponError ? "border-rose-500" : "border-slate-700"
                    }`}
                    placeholder="Enter coupon (e.g. VIP20)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={isValidating || !values.coupon}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition disabled:opacity-50 border border-slate-700 shrink-0"
                >
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

              {couponError && (
                <p className="text-rose-400 text-xs mt-2 font-medium">
                  {couponError}
                </p>
              )}
              {validatedCoupon && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Coupon applied: {values.coupon} (
                    {validatedCoupon.discount_type.toUpperCase() === "PERCENTAGE"
                      ? `${validatedCoupon.discount_value}% off`
                      : `KES ${validatedCoupon.discount_value.toLocaleString()} off per ticket`}
                    )
                  </span>
                </div>
              )}
            </div>

            {/* 4. Order Total Breakdown */}
            {values.ticket_type && values.quantity > 0 && selectedTicket && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>
                    {selectedTicket.name} × {values.quantity}
                  </span>
                  <span>KES {subTotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-medium">
                    <span>Discount applied:</span>
                    <span>- KES {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-white">
                  <div>
                    <span className="text-sm font-semibold">Total to Pay</span>
                    <p className="text-[11px] text-slate-400">Zero booking fees</p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* 5. Attendee Information */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-sm font-semibold text-white">
                Attendee Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <Field
                    name="name"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. John Kamau"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-rose-400 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-slate-500">(Optional for receipt)</span>
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="john@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-rose-400 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  M-Pesa Phone Number <span className="text-rose-400">*</span>
                </label>
                <Field
                  name="phone"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="254712345678"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-rose-400 text-xs mt-1"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  We will send the M-Pesa STK push and your digital pass link to this number.
                </p>
              </div>
            </div>

            {/* 6. Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Tickets...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to M-Pesa Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
