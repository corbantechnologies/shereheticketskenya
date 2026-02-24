/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// components/events/CreateEvent.tsx
"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { createEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useRouter } from "next/navigation";

interface CreateEventProps {
  companyCode: string;
  closeModal: () => void;
  refetchEvents: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.date().required("Start date is required"),
  venue: Yup.string().required("Venue is required"),
});

export default function CreateEvent({
  companyCode,
  closeModal,
  refetchEvents,
}: CreateEventProps) {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Removed */}

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <Formik
          initialValues={{
            name: "",
            description: "",
            start_date: "",
            venue: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              formData.append("start_date", values.start_date);
              formData.append("venue", values.venue);
              formData.append("company", companyCode);

              await createEvent(formData, { headers: axiosAuth.headers });

              toast.success("Event created successfully! Click on the newly created event to complete setup.");
              refetchEvents();
              closeModal();
            } catch (error: any) {
              console.error("Create event error:", error);
              toast.error(
                error.response?.data?.detail ||
                error.response?.data?.non_field_errors?.[0] ||
                "Failed to create event. Please try again.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-10">
              {/* Event Name & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Name <span className="text-destructive">*</span>
                  </label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="e.g. New Year's Bash 2026"
                    className="mt-2 text-sm"
                  />
                  {errors.name && touched.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Venue <span className="text-destructive">*</span>
                  </label>
                  <Field
                    as={Input}
                    id="venue"
                    name="venue"
                    placeholder="e.g. Ngong Racecourse, Nairobi"
                    className="mt-2 text-sm"
                  />
                  {errors.venue && touched.venue && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.venue as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Tell attendees what makes this event special..."
                  rows={6}
                  className="mt-2 text-sm"
                />
                {errors.description && touched.description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.description as string}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Start Date <span className="text-destructive">*</span>
                </label>
                <div className="mt-2">
                  <Field
                    type="date"
                    name="start_date"
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring w-full max-w-md"
                  />
                </div>
                {errors.start_date && touched.start_date && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.start_date as string}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 px-10"
                >
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
