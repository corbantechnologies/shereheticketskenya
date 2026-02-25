/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { apiActions } from "@/tools/axios";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

function CreateTicketType({ closeModal, refetch, event }: any) {
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
    quantity_available: Yup.number()
      .nullable()
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value)
      .test(
        "is-required-if-limited",
        "Quantity is required when limited",
        function (value) {
          const { is_limited } = this.parent;
          if (is_limited) {
            return value !== null && value !== undefined;
          }
          return true;
        }
      )
      .test(
        "min-quantity",
        "Quantity must be at least 1",
        function (value) {
          if (value === null || value === undefined) return true;
          return value >= 1;
        }
      ),
    is_limited: Yup.boolean(),
    sales_start: Yup.date()
      .nullable()
      .test(
        "before-event",
        "Sales must start before the event concludes.",
        function (value) {
          if (!value) return true;
          const eventCutoffDateString = event?.end_date || event?.start_date;
          if (!eventCutoffDateString) return true;

          const eventCutoffDate = new Date(eventCutoffDateString);
          eventCutoffDate.setHours(0, 0, 0, 0);
          const cutoffPlusOne = new Date(eventCutoffDate);
          cutoffPlusOne.setDate(cutoffPlusOne.getDate() + 1);

          if (new Date(value) >= cutoffPlusOne) {
            return this.createError({
              message: `Sales must start before the event concludes on ${format(eventCutoffDate, "MMM d, yyyy")}.`
            });
          }
          return true;
        }
      ),
    sales_end: Yup.date()
      .nullable()
      .test(
        "is-after-start",
        "Sales end date must be after sales start date",
        function (value) {
          const { sales_start } = this.parent;
          if (!value || !sales_start) return true;
          return new Date(value) > new Date(sales_start);
        }
      )
      .test(
        "before-event",
        "Sales must end before or on the day the event concludes.",
        function (value) {
          if (!value) return true;
          const eventCutoffDateString = event?.end_date || event?.start_date;
          if (!eventCutoffDateString) return true;

          const eventCutoffDate = new Date(eventCutoffDateString);
          eventCutoffDate.setHours(0, 0, 0, 0);
          const cutoffPlusOne = new Date(eventCutoffDate);
          cutoffPlusOne.setDate(cutoffPlusOne.getDate() + 1);

          if (new Date(value) > cutoffPlusOne) {
            return this.createError({
              message: `Sales must end before or on ${format(eventCutoffDate, "MMM d, yyyy")}.`
            });
          }
          return true;
        }
      ),
    is_active: Yup.boolean(),
  });

  return (
    <div className="w-full">
      {/* Header removed as it is handled by the Modal component */}

      <Formik
        initialValues={{
          event: event?.event_code,
          name: "",
          price: "",
          quantity_available: "",
          is_limited: false,
          sales_start: "",
          sales_end: "",
          is_active: true,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();
            formData.append("event", values.event);
            formData.append("name", values.name);
            formData.append(
              "price",
              values.price ? values.price.toString() : "0"
            );
            formData.append(
              "quantity_available",
              values.quantity_available
                ? values.quantity_available.toString()
                : ""
            );
            formData.append("is_limited", values.is_limited.toString());

            if (values.sales_start) {
              formData.append("sales_start", new Date(values.sales_start).toISOString());
            }
            if (values.sales_end) {
              formData.append("sales_end", new Date(values.sales_end).toISOString());
            }
            formData.append("is_active", values.is_active.toString());

            await apiActions?.post(`/api/v1/tickettypes/`, formData, axios);
            toast.success("Ticket type created successfully.");
            setLoading(false);
            closeModal();
            refetch();
          } catch (error: any) {
            console.log(error);
            if (error.response.data["non_field_errors"][0]) {
              toast.error(error.response.data["non_field_errors"][0]);
            } else {
              toast.error("Error creating ticket type. Please try again.");
            }
            setLoading(false);
            closeModal();
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ values, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className={`mt-1 block w-full border ${errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 bg-white`}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Field
                type="number"
                name="price"
                className={`mt-1 block w-full border ${errors.price && touched.price ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 bg-white`}
              />
              {errors.price && touched.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity Available {values.is_limited && <span className="text-gray-500 text-xs">(Required if limited)</span>}
              </label>
              <Field
                type="number"
                name="quantity_available"
                className={`mt-1 block w-full border ${errors.quantity_available && touched.quantity_available ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm p-2 bg-white`}
              />
              {errors.quantity_available && touched.quantity_available && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity_available as string}</p>
              )}
            </div>

            <div className="flex items-center">
              <Field
                type="checkbox"
                name="is_limited"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Is Limited
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sales Start (Optional)
                </label>
                <Field
                  type="datetime-local"
                  name="sales_start"
                  className={`mt-1 block w-full border ${errors.sales_start && touched.sales_start ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 bg-white`}
                />
                {errors.sales_start && touched.sales_start && (
                  <p className="text-red-500 text-xs mt-1">{errors.sales_start as string}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sales End (Optional)
                </label>
                <Field
                  type="datetime-local"
                  name="sales_end"
                  className={`mt-1 block w-full border ${errors.sales_end && touched.sales_end ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 bg-white`}
                />
                {errors.sales_end && touched.sales_end && (
                  <p className="text-red-500 text-xs mt-1">{errors.sales_end as string}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Field
                type="checkbox"
                name="is_active"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Is Active
              </label>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket Type"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateTicketType;
