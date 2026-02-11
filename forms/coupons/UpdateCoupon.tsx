/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateCoupon } from "@/services/coupons";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface UpdateCouponProps {
    closeModal: () => void;
    refetch: () => void;
    coupon: any;
    event: any;
}

function UpdateCoupon({ closeModal, refetch, coupon, event }: UpdateCouponProps) {
    const { headers } = useAxiosAuth();
    const [loading, setLoading] = useState(false);

    // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().slice(0, 16);
    };

    return (
        <div className="w-full">
            {/* Header removed as it is handled by the Modal component */}

            <Formik
                initialValues={{
                    name: coupon?.name || "",
                    discount_type: coupon?.discount_type || "FIXED",
                    discount_value: coupon?.discount_value || "",
                    valid_from: formatDate(coupon?.valid_from),
                    valid_to: formatDate(coupon?.valid_to),
                    usage_limit: coupon?.usage_limit || "",
                    is_active: coupon?.is_active ?? true,
                    ticket_type: coupon?.ticket_type || [],
                }}
                enableReinitialize
                onSubmit={async (values) => {
                    setLoading(true);
                    try {
                        const formData = new FormData();
                        if (values.name) formData.append("name", values.name);
                        formData.append("discount_type", values.discount_type);
                        formData.append("discount_value", values.discount_value);
                        formData.append("valid_from", new Date(values.valid_from).toISOString());
                        formData.append("valid_to", new Date(values.valid_to).toISOString());
                        if (values.usage_limit !== "")
                            formData.append("usage_limit", values.usage_limit.toString());
                        formData.append("is_active", values.is_active.toString());

                        // Handle array of ticket types
                        values.ticket_type.forEach((tt: string) => {
                            formData.append("ticket_type", tt);
                        });

                        await updateCoupon(coupon.reference, formData, { headers });
                        toast.success("Coupon updated successfully.");
                        setLoading(false);
                        closeModal();
                        refetch();
                    } catch (error: any) {
                        console.log(error);
                        if (error?.response?.data) {
                            const errorData = error.response.data;
                            const errorMessage = typeof errorData === 'object'
                                ? Object.values(errorData).flat().join(', ')
                                : "Error updating coupon.";
                            toast.error(errorMessage);
                        } else {
                            toast.error("Error updating coupon. Please try again.");
                        }
                        setLoading(false);
                    }
                }}
            >
                {({ values }) => (
                    <Form className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <Field
                                type="text"
                                name="name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Optional coupon name"
                            />
                        </div>

                        {/* Discount Type & Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                                <Field
                                    as="select"
                                    name="discount_type"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="FIXED">Fixed Amount</option>
                                    <option value="PERCENTAGE">Percentage</option>
                                </Field>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                                <Field
                                    type="number"
                                    name="discount_value"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        {/* Validity Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Valid From</label>
                                <Field
                                    type="datetime-local"
                                    name="valid_from"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Valid To</label>
                                <Field
                                    type="datetime-local"
                                    name="valid_to"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
                            <Field
                                type="number"
                                name="usage_limit"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Leave blank for unlimited"
                            />
                        </div>

                        {/* Ticket Types */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Ticket Types</label>
                            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 p-2 rounded-md">
                                {event?.ticket_types?.map((tt: any) => (
                                    <div key={tt.ticket_type_code} className="flex items-center">
                                        <Field
                                            type="checkbox"
                                            name="ticket_type"
                                            value={tt.ticket_type_code}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 text-sm text-gray-900">
                                            {tt.name} ({tt.ticket_type_code}) - {tt.price}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Is Active */}
                        <div className="flex items-center">
                            <Field
                                type="checkbox"
                                name="is_active"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Is Active</label>
                        </div>

                        {/* Metadata Display (Read-Only) */}
                        <div className="mt-4 p-4 bg-gray-50 rounded text-xs text-gray-500">
                            <p>Code: {coupon?.code}</p>
                            <p>Created At: {new Date(coupon?.created_at).toLocaleString()}</p>
                            <p>Usage Count: {coupon?.usage_count}</p>
                        </div>


                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Coupon"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default UpdateCoupon;