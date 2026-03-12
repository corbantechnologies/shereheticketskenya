/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const resetPasswordSchema = Yup.object().shape({
  code: Yup.string().required("Reset code is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <Card className="py-0 border-none shadow-lg bg-white">
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Invalid session. Please restart the password reset process.
          </p>
          <Button
            onClick={() => router.push("/forgot-password")}
            className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white h-10 text-sm"
          >
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0 border-none shadow-lg bg-white">
      <CardContent className="p-6">
        <Formik
          initialValues={{ code: "", password: "", password_confirmation: "" }}
          validationSchema={resetPasswordSchema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await resetPassword({
                email,
                code: values.code,
                password: values.password,
                password_confirmation: values.password_confirmation,
              });
              toast.success("Password reset successful! Please sign in.");
              router.push("/login");
            } catch (error: any) {
              toast.error(
                error.response?.data?.detail || "Failed to reset password. Check your code."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">

              {/* Code */}
              <div className="space-y-1.5">
                <Label className="text-sm text-foreground/80">Verification code</Label>
                <Field
                  name="code"
                  as={Input}
                  placeholder="Enter 6-digit code"
                  className="h-10 text-sm text-center tracking-widest font-mono"
                />
                {errors.code && touched.code && (
                  <p className="text-red-500 text-xs">{errors.code}</p>
                )}
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground/80">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      name="password"
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10 h-10 text-sm"
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Field
                      name="password_confirmation"
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10 h-10 text-sm"
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

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full h-10 bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-sm"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Reset password</span>
                  </div>
                )}
              </Button>

            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#d5d5d5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-xl font-semibold tracking-tight">
              Sherehe <span className="text-[var(--mainRed)]">Tickets</span>
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground mt-4">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the code sent to your email and choose a new password.
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="py-0 border-none shadow-lg bg-white">
              <CardContent className="p-6 flex justify-center">
                <div className="w-6 h-6 border-2 border-muted border-t-foreground rounded-full animate-spin" />
              </CardContent>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-5 text-center text-sm">
          <Link href="/login" className="inline-flex items-center gap-1 text-[var(--mainBlue)] hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
