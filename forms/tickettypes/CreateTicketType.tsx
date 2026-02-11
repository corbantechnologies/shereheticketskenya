/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { apiActions } from "@/tools/axios";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

function CreateTicketType({ closeModal, refetch, event }: any) {
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);

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
        }}
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
        {({ values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Field
                type="number"
                name="price"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity Available
              </label>
              <Field
                type="number"
                name="quantity_available"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
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
