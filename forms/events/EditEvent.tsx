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
  start_date: Yup.date()
    .required("Start date is required")
    .test(
      "is-future",
      "Start date cannot be in the past",
      function (value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(value) >= today;
      }
    ),
  start_time: Yup.string(),
  end_date: Yup.date()
    .nullable()
    .test(
      "is-after-start",
      "End date cannot be before start date",
      function (value) {
        const { start_date } = this.parent;
        if (!value || !start_date) return true;
        const start = new Date(start_date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(value);
        end.setHours(0, 0, 0, 0);
        return end >= start;
      }
    ),
  end_time: Yup.string()
    .nullable()
    .test(
      "is-greater",
      "End time must be after start time on the same day",
      function (value) {
        const { start_date, end_date, start_time } = this.parent;
        if (start_date && end_date && start_time && value) {
          const isSameDay =
            new Date(start_date).toDateString() ===
            new Date(end_date).toDateString();
          if (isSameDay) {
            return value > start_time;
          }
        }
        return true;
      }
    ),
  venue: Yup.string().required("Venue is required"),
  capacity: Yup.number().nullable().min(1, "Capacity must be at least 1"),
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
            capacity: event.capacity || "",
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
              if (values.capacity) {
                formData.append("capacity", values.capacity.toString());
              }
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
            <Form className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update the details and settings for <span className="font-semibold text-gray-900">{event.name}</span>
                </p>
              </div>

              {/* Basic Details Section */}
              <div className="bg-gray-50/30 p-4 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Basic Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Event Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="e.g. New Year's Bash 2026"
                      className="mt-2 text-sm bg-white"
                    />
                    {errors.name && touched.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name as string}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
                      Venue <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="venue"
                      name="venue"
                      placeholder="e.g. Ngong Racecourse, Nairobi"
                      className="mt-2 text-sm bg-white"
                    />
                    {errors.venue && touched.venue && (
                      <p className="text-destructive text-sm mt-1">{errors.venue as string}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 flex items-center">
                      Total Capacity <span className="text-muted-foreground text-xs font-normal ml-2">(Optional)</span>
                    </Label>
                    <Field
                      as={Input}
                      type="number"
                      id="capacity"
                      name="capacity"
                      placeholder="e.g. 500"
                      className="mt-2 text-sm bg-white"
                    />
                    {errors.capacity && touched.capacity && (
                      <p className="text-destructive text-sm mt-1">{errors.capacity as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Tell attendees what makes this event special..."
                    rows={5}
                    className="mt-2 text-sm bg-white"
                  />
                  {errors.description && touched.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description as string}</p>
                  )}
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Scheduling</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date & Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Field
                          type="date"
                          name="start_date"
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                        />
                        {errors.start_date && touched.start_date && (
                          <p className="text-destructive text-xs mt-1">{errors.start_date as string}</p>
                        )}
                      </div>
                      <div>
                        <Field
                          type="time"
                          name="start_time"
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                        />
                        {errors.start_time && touched.start_time && (
                          <p className="text-destructive text-xs mt-1">{errors.start_time as string}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      End Date & Time <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Field
                          type="date"
                          name="end_date"
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                        />
                        {errors.end_date && touched.end_date && (
                          <p className="text-destructive text-xs mt-1">{errors.end_date as string}</p>
                        )}
                      </div>
                      <div>
                        <Field
                          type="time"
                          name="end_time"
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                        />
                        {errors.end_time && touched.end_time && (
                          <p className="text-destructive text-xs mt-1">{errors.end_time as string}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies & Media Section */}
              <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Policies & Media</h3>

                <div>
                  <Label htmlFor="cancellation_policy" className="text-sm font-medium text-gray-700">
                    Cancellation Policy <span className="text-destructive">*</span>
                  </Label>
                  <Field
                    as={Textarea}
                    id="cancellation_policy"
                    name="cancellation_policy"
                    placeholder="Describe your policy for ticket cancellations and refunds..."
                    rows={4}
                    className="mt-2 text-sm bg-white"
                  />
                  {errors.cancellation_policy && touched.cancellation_policy && (
                    <p className="text-destructive text-sm mt-1">{errors.cancellation_policy as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Event Image <span className="text-muted-foreground text-xs font-normal">(Optional - leave blank to keep current)</span>
                  </Label>
                  <div className="mt-3">
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
                      className="block w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:font-medium file:bg-[var(--mainBlue)] file:text-white hover:file:bg-[var(--mainBlue)]/90 cursor-pointer bg-white border border-gray-200"
                    />
                    {errors.image && touched.image && (
                      <p className="text-destructive text-sm mt-2">{errors.image as string}</p>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Image Preview</p>
                      <img
                        src={imagePreview}
                        alt="Event image preview"
                        className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-red-900">Event Status</h3>
                  <p className="text-sm text-red-700/80 mt-1">Closing an event will stop all ticket registrations and sales.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-lg border border-red-200 shadow-sm">
                  <Field
                    type="checkbox"
                    id="is_closed"
                    name="is_closed"
                    className="h-5 w-5 rounded border-gray-300 text-[var(--mainRed)] focus:ring-[var(--mainRed)] cursor-pointer"
                  />
                  <Label htmlFor="is_closed" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    Close Event
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 px-8"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
