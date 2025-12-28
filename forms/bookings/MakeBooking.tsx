// forms/bookings/MakeBooking.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketType {
  identity: string;
  name: string;
  price: string;
  quantity_available?: number | null;
}

interface Event {
  event_code: string;
  name: string;
  ticket_types: TicketType[];
}

interface MakeBookingProps {
  event: Event;
  closeModal: () => void;
  refetchEvent?: () => void;
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
          (t: TicketType) => t.identity === ticketType
        );
        return (
          !ticket?.quantity_available || value! <= ticket.quantity_available
        );
      }
    ),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string().required("Phone number is required"),
});

export default function MakeBooking({
  event,
  closeModal,
  refetchEvent,
}: MakeBookingProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hasAvailableTickets = event.ticket_types.some(
    (ticket) =>
      ticket.quantity_available === null || ticket.quantity_available > 0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Book Tickets</h2>
            <p className="text-muted-foreground mt-1">{event.name}</p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {!hasAvailableTickets ? (
            <div className="text-center py-12">
              <p className="text-xl text-destructive font-medium mb-6">
                Sorry, no tickets are available for this event.
              </p>
              <Button onClick={closeModal} size="lg">
                Close
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={{
                ticket_type: "",
                quantity: 1,
                name: "",
                email: "",
                phone: "",
              }}
              validationSchema={validationSchema}
              context={{ ticket_types: event.ticket_types }}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                try {
                  // TODO: Replace with actual API call when ready
                  console.log("Booking submitted:", values);
                  // Simulate success
                  alert("Booking successful! Redirecting to payment...");
                  if (refetchEvent) refetchEvent();
                  closeModal();
                  // router.push(`/payment/some-reference`);
                } catch (error) {
                  console.error(error);
                  alert("Booking failed. Please try again.");
                } finally {
                  setLoading(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting }) => {
                const selectedTicket = event.ticket_types.find(
                  (t) => t.identity === values.ticket_type
                );
                const maxQuantity = selectedTicket?.quantity_available || 20;

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
                        {event.ticket_types.map((ticket) => (
                          <option
                            key={ticket.identity}
                            value={ticket.identity}
                            disabled={
                              ticket.quantity_available !== null &&
                              ticket.quantity_available <= 0
                            }
                          >
                            {ticket.name} - KES{" "}
                            {parseFloat(ticket.price).toLocaleString()}
                            {ticket.quantity_available !== null &&
                              ` (${ticket.quantity_available} available)`}
                          </option>
                        ))}
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
                                Math.max(1, values.quantity - 1)
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
                                Math.min(maxQuantity, values.quantity + 1)
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

                    {/* Total Cost */}
                    {values.ticket_type &&
                      values.quantity > 0 &&
                      selectedTicket && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-xl font-bold">
                            Total: KES{" "}
                            {(
                              parseFloat(selectedTicket.price) * values.quantity
                            ).toLocaleString()}
                          </p>
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
                    <div className="flex justify-end gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
                      >
                        {loading ? "Processing..." : "Proceed to Payment"}
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
