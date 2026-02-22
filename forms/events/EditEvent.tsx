/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// forms/events/EditEvent.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { updateEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

interface EditEventProps {
  event: any;
  closeModal: () => void;
  refetchEvent: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.date().required("Start date is required"),
  start_time: Yup.string(),
  end_date: Yup.date().nullable(),
  end_time: Yup.string().nullable(),
  venue: Yup.string().required("Venue is required"),
  cancellation_policy: Yup.string().required("Cancellation policy is required"),
  image: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "File too large (max 5MB)",
      (value) =>
        !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Only image files allowed",
      (value) =>
        !value || (value instanceof File && value.type.startsWith("image/"))
    ),
});

export default function EditEvent({
  event,
  closeModal,
  refetchEvent,
}: EditEventProps) {
  const [imagePreview, setimagePreview] = useState<string | null>(
    event.image || null
  );
  const axiosAuth = useAxiosAuth();

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Removed Header as it's handled by Modal */}

      {/* Scrollable Form */}
      <div className="flex-1 p-1">
        <Formik
          initialValues={{
            name: event.name || "",
            description: event.description || "",
            start_date: event.start_date || "",
            start_time: event.start_time || "",
            end_date: event.end_date || "",
            end_time: event.end_time || "",
            venue: event.venue || "",
            cancellation_policy: event.cancellation_policy || "",
            image: null as File | null,
            is_closed: event.is_closed || false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);
              formData.append("start_date", values.start_date);
              if (values.start_time)
                formData.append("start_time", values.start_time);
              if (values.end_date) formData.append("end_date", values.end_date);
              if (values.end_time) formData.append("end_time", values.end_time);
              formData.append("venue", values.venue);
              formData.append("cancellation_policy", values.cancellation_policy);
              formData.append("is_closed", values.is_closed.toString());

              if (values.image) {
                formData.append("image", values.image);
              }

              await updateEvent(event.event_code, formData, {
                headers: axiosAuth.headers,
              });

              toast.success("Event updated successfully!");
              refetchEvent();
              closeModal();
            } catch (error: any) {
              console.error("Update event error:", error);
              toast.error(
                error.response?.data?.detail ||
                error.response?.data?.non_field_errors?.[0] ||
                "Failed to update event. Please try again."
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <h2 className="text-3xl font-bold mb-4">Edit Event: {event.name}</h2>
              {/* Event Name & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="name" className="text-lg font-medium">
                    Event Name <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="e.g. New Year's Bash 2026"
                    className="mt-2 text-lg"
                  />
                  {errors.name && touched.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name as string}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="venue" className="text-lg font-medium">
                    Venue <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="venue"
                    name="venue"
                    placeholder="e.g. Ngong Racecourse, Nairobi"
                    className="mt-2 text-lg"
                  />
                  {errors.venue && touched.venue && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.venue as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-lg font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Tell attendees what makes this event special..."
                  rows={6}
                  className="mt-2 text-base"
                />
                {errors.description && touched.description && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.description as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cancellation_policy" className="text-lg font-medium">
                  Cancellation Policy <span className="text-destructive">*</span>
                </Label>
                <Field
                  as={Textarea}
                  id="cancellation_policy"
                  name="cancellation_policy"
                  placeholder="Describe your policy for ticket cancellations and refunds..."
                  rows={4}
                  className="mt-2 text-base"
                />
                {errors.cancellation_policy && touched.cancellation_policy && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.cancellation_policy as string}
                  </p>
                )}
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Start Date & Time{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Field
                      type="date"
                      name="start_date"
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring"
                    />
                    <Field
                      type="time"
                      name="start_time"
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  {errors.start_date && touched.start_date && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.start_date as string}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    End Date & Time (Optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Field
                      type="date"
                      name="end_date"
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring"
                    />
                    <Field
                      type="time"
                      name="end_time"
                      className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* image Upload */}
              <div>
                <Label
                  htmlFor="image"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Event image (Optional - leave blank to keep current)
                </Label>
                <div className="mt-4">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue("image", file);
                        setimagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--mainBlue)] file:text-white hover:file:bg-[var(--mainBlue)]/90 cursor-pointer"
                  />
                  {errors.image && touched.image && (
                    <p className="text-destructive text-sm mt-2">
                      {errors.image as string}
                    </p>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-3">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Event image preview"
                      className="w-full max-w-2xl h-96 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3">
                <Field
                  type="checkbox"
                  id="is_closed"
                  name="is_closed"
                  className="h-6 w-6 rounded border-gray-300 text-[var(--mainRed)] focus:ring-[var(--mainRed)]"
                />
                <Label htmlFor="is_closed" className="text-lg font-medium">
                  Event Closed
                </Label>
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
                  {isSubmitting ? "Updating Event..." : "Update Event"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
