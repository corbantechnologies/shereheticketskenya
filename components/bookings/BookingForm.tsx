// components/bookings/BookingForm.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/axios";
import { CouponValidationResponse, validateCoupon } from "@/services/coupons";
import { Loader2 } from "lucide-react";
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
  ticket_type: Yup.string().required("Please select a ticket type"),
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
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string().required("Phone number is required"),
  coupon: Yup.string().optional(),
});

export default function BookingForm({ event, onSuccess, onCancel, initialTicketType }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedCoupon, setValidatedCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const router = useRouter();

  const hasAvailableTickets = event.ticket_types.some((ticket) => {
    if (ticket.status) {
      return ticket.status === "ON_SALE";
    }
    return ticket.quantity_available === null || ticket.quantity_available > 0;
  });

  if (!hasAvailableTickets) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-destructive font-medium mb-6">
          Sorry, no tickets are available for this event.
        </p>
        {onCancel && (
          <Button onClick={onCancel} size="lg">
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        ticket_type: initialTicketType || "",
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
            router.push(`/events/${event.event_code}/${response?.data?.reference}`);
          }
        } catch (error) {
          toast.error("Error making booking. Please try again.");
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting, errors, touched }) => {
        const selectedTicket = event.ticket_types.find(
          (t) => t.ticket_type_code === values.ticket_type,
        );
        const maxQuantity = selectedTicket?.quantity_available || 20;

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

        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subTotal);
        const total = Math.max(0, subTotal - discountAmount);

        return (
          <Form className="space-y-6">
            {/* Ticket Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ticket Type
              </label>
              <Field
                as="select"
                name="ticket_type"
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
              >
                <option value="">Select a ticket type</option>
                {event.ticket_types.map((ticket) => {
                  const discountedPrice = validatedCoupon?.valid_tickets?.find(
                    (vt) => vt.ticket_type_code === ticket.ticket_type_code
                  )?.discounted_price;

                  return (
                    <option
                      key={ticket.reference}
                      value={ticket.ticket_type_code}
                      disabled={
                        (ticket.status && ticket.status !== "ON_SALE") ||
                        (!ticket.status && ticket.quantity_available !== null && ticket.quantity_available <= 0)
                      }
                    >
                      {ticket.name} - KES{" "}
                      {discountedPrice
                        ? `${discountedPrice.toLocaleString()} (was ${parseFloat(ticket.price).toLocaleString()})`
                        : parseFloat(ticket.price).toLocaleString()}
                      {ticket.quantity_available !== null &&
                        ` (${ticket.quantity_available} available)`}
                      {ticket.status && ticket.status !== "ON_SALE" && ` - ${ticket.status.replace("_", " ")}`}
                    </option>
                  );
                })}
              </Field>
              <ErrorMessage
                name="ticket_type"
                component="p"
                className="text-destructive text-sm mt-1"
              />
            </div>

            {/* Quantity */}
            {values.ticket_type && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue(
                        "quantity",
                        Math.max(1, values.quantity - 1),
                      )
                    }
                    className="w-12 h-12 border border-input rounded-lg hover:bg-muted"
                    disabled={values.quantity <= 1}
                  >
                    -
                  </button>
                  <Field
                    name="quantity"
                    type="number"
                    className="w-24 px-4 py-3 text-center border border-input rounded-lg"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue(
                        "quantity",
                        Math.min(maxQuantity, values.quantity + 1),
                      )
                    }
                    className="w-12 h-12 border border-input rounded-lg hover:bg-muted"
                    disabled={values.quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>
                <ErrorMessage
                  name="quantity"
                  component="p"
                  className="text-destructive text-sm mt-1"
                />
              </div>
            )}

            {/* Coupon Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Field
                    name="coupon"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary ${couponError
                      ? "border-destructive"
                      : "border-input"
                      }`}
                    placeholder="Enter coupon code"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleValidateCoupon}
                  disabled={isValidating || !values.coupon}
                  className="h-[50px] px-6"
                >
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponError && (
                <p className="text-destructive text-sm mt-1">
                  {couponError}
                </p>
              )}
              {validatedCoupon && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon applied: {values.coupon} (
                  {validatedCoupon.discount_type.toUpperCase() === "PERCENTAGE"
                    ? `${validatedCoupon.discount_value}% off`
                    : `KES ${validatedCoupon.discount_value.toLocaleString()} off per ticket`}
                  )
                </p>
              )}
              <ErrorMessage
                name="coupon"
                component="p"
                className="text-destructive text-sm mt-1"
              />
            </div>

            {/* Total Cost */}
            {values.ticket_type &&
              values.quantity > 0 &&
              selectedTicket && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal:
                    </span>
                    <span>KES {subTotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>
                        - KES {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                    <span>Total:</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Field
                  name="name"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-destructive text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email (Optional)
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="john@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-destructive text-sm mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Field
                name="phone"
                className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                placeholder="254712345678"
              />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-destructive text-sm mt-1"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Complete your booking within 15 minutes to secure your
              tickets.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 pb-12 lg:pb-0">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 flex-1 lg:flex-none"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
