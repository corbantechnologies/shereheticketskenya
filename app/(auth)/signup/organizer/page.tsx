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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  UserPlus,
  Music,
  Ticket,
  Star,
  Sparkles,
  Users,
} from "lucide-react";
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
  agreed_to_terms: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

export default function OrganizerSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--mainRed)]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--mainBlue)]/10 blur-[150px] rounded-full animate-pulse delay-700" />

      {/* Left Decoration Section - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 z-10 text-white space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-[var(--mainRed)]">
            <Sparkles className="h-4 w-4" />
            Join Kenya&apos;s #1 Event Platform
          </div>
          <h1 className="text-6xl xl:text-7xl font-bold leading-tight">
            Create. Manage. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mainRed)] to-[#FF8C8C]">
              Succeed.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-xl leading-relaxed font-light">
            Empower your sherehe with world-class ticketing tools. Reach
            thousands of attendees and manage your events like a pro.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[
            {
              icon: Music,
              title: "Any Event Type",
              desc: "Concerts, festivals, or corporate.",
            },
            {
              icon: Ticket,
              title: "Instant Payouts",
              desc: "Get your funds quickly after sales.",
            },
            {
              icon: Users,
              title: "Crowd Control",
              desc: "Advanced scanning and entry tools.",
            },
            {
              icon: Star,
              title: "Premium Branding",
              desc: "Custom event pages that wow.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default group"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--mainRed)]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-[var(--mainRed)]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-500 font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <Card className="w-full max-w-2xl bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--mainRed)] flex items-center justify-center mb-6 shadow-xl shadow-[var(--mainRed)]/30">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">
              Create Organizer Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg mt-2 font-light">
              Enter your details to start hosting events today.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
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
                  toast.success("Account created successfully! Please log in.");
                  router.push("/login");
                } catch (error: any) {
                  console.error("Signup error:", error);
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
                <Form className="space-y-6">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">First Name</Label>
                      <Field
                        name="first_name"
                        as={Input}
                        className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl"
                        placeholder="John"
                      />
                      {errors.first_name && touched.first_name && (
                        <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                          {errors.first_name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Last Name</Label>
                      <Field
                        name="last_name"
                        as={Input}
                        className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl"
                        placeholder="Doe"
                      />
                      {errors.last_name && touched.last_name && (
                        <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Email Address
                      </Label>
                      <Field
                        name="email"
                        as={Input}
                        type="email"
                        className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl"
                        placeholder="john@example.com"
                      />
                      {errors.email && touched.email && (
                        <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Phone Number</Label>
                      <Field
                        name="phone_number"
                        as={Input}
                        className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl"
                        placeholder="254..."
                      />
                      {errors.phone_number && touched.phone_number && (
                        <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                          {errors.phone_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Country</Label>
                    <Field
                      name="country"
                      as={Input}
                      className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl"
                      placeholder="Kenya"
                    />
                    {errors.country && touched.country && (
                      <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  {/* Password Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                      <Label className="text-gray-300 ml-1">Password</Label>
                      <div className="relative">
                        <Field
                          name="password"
                          as={Input}
                          type={showPassword ? "text" : "password"}
                          className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 relative">
                      <Label className="text-gray-300 ml-1">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Field
                          name="password_confirmation"
                          as={Input}
                          type={showConfirmPassword ? "text" : "password"}
                          className="bg-white/10 border-white/10 text-white h-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-xl pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password_confirmation &&
                        touched.password_confirmation && (
                          <p className="text-[var(--mainRed)] text-xs mt-1 font-medium">
                            {errors.password_confirmation}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-start gap-3 mt-2 group cursor-pointer">
                      <Field
                        type="checkbox"
                        name="agreed_to_terms"
                        className="h-5 w-5 rounded border-white/20 bg-white/10 text-[var(--mainRed)] focus:ring-[var(--mainRed)] focus:ring-offset-0 transition-all cursor-pointer mt-1"
                      />
                      <Label className="text-sm text-gray-400 font-light leading-relaxed cursor-pointer select-none">
                        By signing up, you agree to our{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="text-[var(--mainRed)] hover:underline font-medium"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and our privacy policy.
                      </Label>
                    </div>
                    {errors.agreed_to_terms && touched.agreed_to_terms && (
                      <p className="text-[var(--mainRed)] text-xs font-medium ml-8 mt-1">
                        {errors.agreed_to_terms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white h-12 rounded-xl text-lg font-bold shadow-xl shadow-[var(--mainRed)]/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-gray-400 font-light">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-[var(--mainRed)] hover:underline font-medium ml-1"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>

      {/* CSS Overrides for checkboxes/etc if needed */}
      <style jsx global>{`
        input[type="checkbox"]:checked {
          background-color: var(--mainRed) !important;
          border-color: var(--mainRed) !important;
        }
      `}</style>
    </div>
  );
}
