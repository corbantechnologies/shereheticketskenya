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
      alert("Company updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update company");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">Update Company Details</h2>

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
          <Form className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Enter company name"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="company@email.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  placeholder="+254 ..."
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Field
                  as={Input}
                  id="website"
                  name="website"
                  placeholder="https://example.com"
                />
                <ErrorMessage
                  name="website"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Field
                    as={Input}
                    id="country"
                    name="country"
                    placeholder="Kenya"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    placeholder="Nairobi"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <Label>Company Logo</Label>
              <div className="mt-2">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Current logo"
                    className="w-32 h-32 rounded-lg object-cover mb-4"
                  />
                )}
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--mainRed)] file:text-white hover:file:bg-[var(--mainRed)]/90"
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <Label>Company Banner</Label>
              <div className="mt-2">
                {bannerPreview && (
                  <img
                    src={bannerPreview}
                    alt="Current banner"
                    className="w-full h-48 rounded-lg object-cover mb-4"
                  />
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--mainBlue)] file:text-white hover:file:bg-[var(--mainBlue)]/90"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
