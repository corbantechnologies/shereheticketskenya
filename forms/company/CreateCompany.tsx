/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCompany } from "@/services/company";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";

interface CreateCompanyProps {
  refetch: () => void;
  closeDialog?: () => void;
}

const createSchema = Yup.object().shape({
  name: Yup.string().required("Organization/Company name is required"),
  country: Yup.string().default("Kenya"),
  city: Yup.string().optional(),
  phone: Yup.string().optional(),
  email: Yup.string().email("Invalid email").optional(),
});

export default function CreateCompany({
  refetch,
  closeDialog,
}: CreateCompanyProps) {
  const [loading, setLoading] = useState(false);
  const header = useAxiosAuth();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    try {
      await createCompany(
        {
          name: values.name.trim(),
        },
        header
      );

      toast.success("New organization company created successfully!");
      refetch();
      if (closeDialog) closeDialog();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.name?.[0] ||
          error?.response?.data?.detail ||
          "Failed to create company. Please check your inputs."
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        country: "Kenya",
        city: "",
        phone: "",
        email: "",
      }}
      validationSchema={createSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Company / Brand Name <span className="text-rose-500">*</span>
            </Label>
            <Field
              as={Input}
              id="name"
              name="name"
              placeholder="e.g. Blankets & Wine Productions"
              className="text-sm h-10 border-slate-200 focus:border-cyan-500"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-xs text-rose-500 mt-1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs font-semibold text-slate-700">
              City / Base Location
            </Label>
            <Field
              as={Input}
              id="city"
              name="city"
              placeholder="e.g. Nairobi"
              className="text-sm h-10 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Support / Inquiries Email
            </Label>
            <Field
              as={Input}
              type="email"
              id="email"
              name="email"
              placeholder="events@yourcompany.co.ke"
              className="text-sm h-10 border-slate-200"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-xs text-rose-500 mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            {closeDialog && (
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading || isSubmitting}
                className="text-xs h-9"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-xs h-9 px-4 font-semibold flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Create Organization</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
