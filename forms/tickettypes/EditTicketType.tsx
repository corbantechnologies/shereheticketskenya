/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { apiActions } from "@/tools/axios";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface EditTicketTypeProps {
  closeModal: () => void;
  refetch: () => void;
  ticketType: any;
}

function EditTicketType({
  closeModal,
  refetch,
  ticketType,
}: EditTicketTypeProps) {
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      {/* Header removed as it is handled by the Modal component */}

      <Formik
        initialValues={{
          name: ticketType?.name || "",
          price: ticketType?.price || "",
          quantity_available: ticketType?.quantity_available || "",
          is_limited: ticketType?.is_limited || false,
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();
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

            await apiActions?.patch(
              `/api/v1/tickettypes/${ticketType.ticket_type_code}/`,
              formData,
              axios
            );
            toast.success("Ticket type updated successfully.");
            setLoading(false);
            closeModal();
            refetch();
          } catch (error: any) {
            console.error(error);
            const errorMessage =
              error.response?.data?.non_field_errors?.[0] ||
              "Error updating ticket type. Please try again.";
            toast.error(errorMessage);
            setLoading(false);
          } finally {
            setLoading(false);
          }
        }}
      >
        {() => (
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
                {loading ? "Updating..." : "Update Ticket Type"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditTicketType;
