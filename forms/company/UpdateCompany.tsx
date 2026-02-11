/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/company/UpdateCompany.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompany } from "@/services/company";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Loader2 } from "lucide-react";

interface Company {
  name: string;
  logo: string | null;
  banner: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  reference: string;
}

interface UpdateCompanyProps {
  company: Company;
  refetch: () => void;
  closeDialog?: () => void;
}

const updateSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  country: Yup.string().nullable(),
  city: Yup.string().nullable(),
  address: Yup.string().nullable(),
  phone: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").nullable(),
  website: Yup.string().url("Invalid URL").nullable(),
});

export default function UpdateCompany({
  company,
  refetch,
  closeDialog,
}: UpdateCompanyProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logo);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    company.banner
  );
  const header = useAxiosAuth();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          if (key === "logo" || key === "banner") {
            if (values[key] instanceof File) {
              formData.append(key, values[key]);
            }
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      await updateCompany(company.reference, formData, header);
      refetch();
      if (closeDialog) closeDialog(); // Close on success
      // alert("Company updated successfully!"); // Removed alert for smoother UX
    } catch (error) {
      console.error(error);
      alert("Failed to update company");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: company.name || "",
        country: company.country || "",
        city: company.city || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
        logo: null as File | null,
        banner: null as File | null,
      }}
      validationSchema={updateSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="w-full">
          {/* Details Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider border-b pb-2">
              Company Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="e.g. Sherehe Events"
                  className="bg-white"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-xs mt-0.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  placeholder="contact@example.com"
                  className="bg-white"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-0.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  placeholder="+254..."
                  className="bg-white"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="website">Website</Label>
                <Field
                  as={Input}
                  id="website"
                  name="website"
                  placeholder="https://..."
                  className="bg-white"
                />
                <ErrorMessage
                  name="website"
                  component="p"
                  className="text-red-500 text-xs mt-0.5"
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider border-b pb-2 mb-4">
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Field
                    as={Input}
                    id="country"
                    name="country"
                    placeholder="Kenya"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    placeholder="Nairobi"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    placeholder="Building, Street, etc."
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Branding Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider border-b pb-2">
              Branding
            </h3>

            {/* Logo Upload */}
            <div className="p-4 border rounded-lg bg-[var(--secondary)]/30 border-dashed border-[var(--border)]">
              <Label className="mb-2 block font-medium">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-16 w-16 object-cover rounded-md border bg-white"
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center rounded-md border bg-white text-gray-300">
                      <span className="text-xs">No Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFieldValue("logo", file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="bg-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Recommended: Square image, 500x500px.
              </p>
            </div>

            {/* Banner Upload */}
            <div className="p-4 border rounded-lg bg-[var(--secondary)]/30 border-dashed border-[var(--border)]">
              <Label className="mb-2 block font-medium">Banner Image</Label>
              <div className="space-y-3">
                {bannerPreview ? (
                  <div className="relative w-full h-16 rounded-md overflow-hidden group border bg-white">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-16 rounded-md border border-dashed flex items-center justify-center bg-white text-gray-300">
                    <span className="text-xs">No Banner</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("banner", file);
                      setBannerPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="bg-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90 cursor-pointer"
                />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Recommended: Wide image, 1200x400px.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto font-semibold px-8 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Company"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
