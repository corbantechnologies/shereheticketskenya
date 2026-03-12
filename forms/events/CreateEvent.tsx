/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// components/events/CreateEvent.tsx
"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { createEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";

interface CreateEventProps {
  companyCode: string;
  closeModal?: () => void;
  refetchEvents?: () => void;
  isPage?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  venue: Yup.string().required("Venue is required"),
  start_date: Yup.date()
    .required("Start date is required")
    .test("is-not-past", "Start date cannot be in the past", function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  end_date: Yup.date()
    .nullable()
    .test("is-after-start", "End date must be after start date", function (value, context) {
      const { start_date } = context.parent;
      if (!value || !start_date) return true;
      return new Date(value) >= new Date(start_date);
    }),
  refund_policy: Yup.mixed().required("Cancellation policy is required"),
  content: Yup.mixed().required("Description & Details are required"),
});

export default function CreateEvent({
  companyCode,
  closeModal,
  refetchEvents,
  isPage = false,
}: CreateEventProps) {
  const headers = useAxiosAuth();
  const router = useRouter();
  const [imagePreview, setimagePreview] = useState<string | null>(null);

  const today = new Date();
  const minDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header Removed */}

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <Formik
          initialValues={{
            name: "",
            description: "",
            content: "",
            start_date: "",
            start_time: "",
            end_date: "",
            end_time: "",
            venue: "",
            refund_policy: "",
            image: null as File | null,
            is_published: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("description", values.description);

              if (values.content) {
                formData.append("content", JSON.stringify(values.content));
              }
              if (values.refund_policy) {
                formData.append("refund_policy", JSON.stringify(values.refund_policy));
              }

              formData.append("start_date", values.start_date);
              if (values.start_time) formData.append("start_time", values.start_time);
              if (values.end_date) formData.append("end_date", values.end_date);
              if (values.end_time) formData.append("end_time", values.end_time);
              
              formData.append("venue", values.venue);
              formData.append("company", companyCode);
              formData.append("is_published", values.is_published.toString());

              if (values.image) {
                formData.append("image", values.image);
              }

              await createEvent(formData, headers);

              toast.success("Event created successfully! Click on the newly created event to complete setup.");
              if (refetchEvents) refetchEvents();
              if (closeModal) closeModal();
              if (isPage) {
                window.history.back();
              }
            } catch (error: any) {
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
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below to launch your event.
                </p>
              </div>

              {/* Basic Details Section */}
              <div className="bg-gray-50/30 p-4 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Basic Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Event Name <span className="text-destructive">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="e.g. New Year's Bash 2026"
                      className="mt-2 text-sm bg-white"
                      required
                    />
                    {errors.name && touched.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name as string}</p>
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
                      required
                    />
                    {errors.venue && touched.venue && (
                      <p className="text-destructive text-xs mt-1">{errors.venue as string}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Short Description
                    </Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="e.g. A quick summary of the event for previews"
                      className="mt-2 text-sm bg-white"
                    />
                  </div>

                  
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Description & Details (Rich Text) <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-2 text-sm">
                    <RichTextEditor
                      value={values.content}
                      onChange={(val) => setFieldValue("content", val)}
                    />
                    {errors.content && touched.content && (
                      <p className="text-destructive text-xs mt-1">{errors.content as string}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-200 space-y-6">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Scheduling</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date <span className="text-destructive">*</span> & Time <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Field
                          type="date"
                          name="start_date"
                          min={minDateString}
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                          required
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
                      </div>
                      <div>
                        <Field
                          type="time"
                          name="end_time"
                          className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-ring w-full text-sm bg-white"
                        />
                        {errors.end_date && touched.end_date && (
                          <p className="text-destructive text-xs mt-1">{errors.end_date as string}</p>
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
                  <Label htmlFor="refund_policy" className="text-sm font-medium text-gray-700">
                    Cancellation Policy <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-2 text-sm">
                    <RichTextEditor
                      value={values.refund_policy}
                      onChange={(val) => setFieldValue("refund_policy", val)}
                    />
                    {errors.refund_policy && touched.refund_policy && (
                      <p className="text-destructive text-xs mt-1">{errors.refund_policy as string}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Event Image <span className="text-muted-foreground text-xs font-normal">(Required)</span>
                  </Label>
                  <div className="mt-3">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFieldValue("image", file);
                          setimagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="block w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:font-medium file:bg-[var(--mainBlue)] file:text-white hover:file:bg-[var(--mainBlue)]/90 cursor-pointer bg-white border border-gray-200"
                    />
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
              <div className="bg-gray-50/30 p-6 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Visibility</h3>
                <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm w-fit">
                  <Field
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    className="h-5 w-5 rounded border-gray-300 text-[var(--mainBlue)] focus:ring-[var(--mainBlue)] cursor-pointer"
                  />
                  <Label htmlFor="is_published" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    Publish Immediately
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Published events are visible to the public. You can keep it as draft by leaving this unchecked.
                </p>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => isPage ? window.history.back() : closeModal?.()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 px-8"
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
