/* eslint-disable @next/next/no-img-element */
// app/(auth)/signup/organizer/page.tsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const signupSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreed_to_terms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

export default function OrganizerSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#d5d5d5] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">

        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-xl font-semibold tracking-tight">
              Sherehe <span className="text-[var(--mainRed)]">Tickets</span>
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground mt-4">Create an organizer account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Start hosting events on Kenya&apos;s #1 ticketing platform.
          </p>
        </div>

        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-6">
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                phone_number: "",
                country: "Kenya",
                password: "",
                password_confirmation: "",
                agreed_to_terms: false,
              }}
              validationSchema={signupSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await signUp({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    phone_number: values.phone_number,
                    country: values.country,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                  });
                  toast.success("Account created! Please sign in.");
                  router.push("/login");
                } catch (error: any) {
                  toast.error(
                    error.response?.data?.detail ||
                      "Failed to create account. Please check your details."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">First name</Label>
                      <Field
                        name="first_name"
                        as={Input}
                        placeholder="John"
                        className="h-10 text-sm"
                      />
                      {errors.first_name && touched.first_name && (
                        <p className="text-red-500 text-xs">{errors.first_name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">Last name</Label>
                      <Field
                        name="last_name"
                        as={Input}
                        placeholder="Doe"
                        className="h-10 text-sm"
                      />
                      {errors.last_name && touched.last_name && (
                        <p className="text-red-500 text-xs">{errors.last_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label className="text-sm text-foreground/80">Email address</Label>
                    <Field
                      name="email"
                      as={Input}
                      type="email"
                      placeholder="john@example.com"
                      className="h-10 text-sm"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone + Country */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">Phone number</Label>
                      <Field
                        name="phone_number"
                        as={Input}
                        placeholder="254..."
                        className="h-10 text-sm"
                      />
                      {errors.phone_number && touched.phone_number && (
                        <p className="text-red-500 text-xs">{errors.phone_number}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">Country</Label>
                      <Field
                        name="country"
                        as={Input}
                        placeholder="Kenya"
                        className="h-10 text-sm"
                      />
                      {errors.country && touched.country && (
                        <p className="text-red-500 text-xs">{errors.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">Password</Label>
                      <div className="relative">
                        <Field
                          name="password"
                          as={Input}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-10 pr-10 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="text-red-500 text-xs">{errors.password}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground/80">Confirm password</Label>
                      <div className="relative">
                        <Field
                          name="password_confirmation"
                          as={Input}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-10 pr-10 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password_confirmation && touched.password_confirmation && (
                        <p className="text-red-500 text-xs">{errors.password_confirmation}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2.5">
                      <Field
                        type="checkbox"
                        name="agreed_to_terms"
                        className="mt-0.5 h-4 w-4 rounded border-border text-[var(--mainBlue)] focus:ring-[var(--mainBlue)] focus:ring-offset-0 cursor-pointer"
                      />
                      <Label className="text-sm text-foreground/70 font-normal leading-snug cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms-and-conditions" className="text-[var(--mainBlue)] hover:underline font-medium">
                          Terms & Conditions
                        </Link>{" "}
                        and privacy policy.
                      </Label>
                    </div>
                    {errors.agreed_to_terms && touched.agreed_to_terms && (
                      <p className="text-red-500 text-xs ml-6">{errors.agreed_to_terms}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-sm mt-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>

                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Sign in link */}
        <div className="mt-5 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--mainBlue)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            © {new Date().getFullYear()} Sherehe · Corban Technologies
          </p>
        </div>

      </div>
    </div>
  );
}
