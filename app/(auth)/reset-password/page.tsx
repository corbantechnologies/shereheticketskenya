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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Lock,
  ShieldCheck,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
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
      <Card className="bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <ShieldCheck className="h-8 w-8 text-red-500" />
        </div>
        <CardTitle className="text-white text-2xl mb-4">
          Invalid Session
        </CardTitle>
        <CardDescription className="text-gray-400 mb-8">
          The password reset email is missing. Please restart the process.
        </CardDescription>
        <Button
          onClick={() => router.push("/forgot-password")}
          className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white rounded-xl w-full h-12"
        >
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="p-10 pb-4 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
          <Key className="h-8 w-8 text-[var(--mainBlue)]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[var(--mainBlue)] mb-4">
          <Sparkles className="h-3 w-3" />
          Verify Identity
        </div>
        <CardTitle className="text-4xl font-bold text-white tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription className="text-gray-400 text-lg mt-2 font-light">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="text-white font-medium">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-10 pt-4">
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
              toast.success("Password reset successful! Please login.");
              router.push("/login");
            } catch (error: any) {
              console.error("Reset password error:", error);
              toast.error(
                error.response?.data?.detail ||
                  "Failed to reset password. Check your code."
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300 ml-1 text-sm">
                  Verification Code
                </Label>
                <Field
                  name="code"
                  as={Input}
                  placeholder="Enter 6-digit code"
                  className="bg-white/10 border-white/10 text-white h-14 focus:ring-[var(--mainBlue)] focus:border-[var(--mainBlue)] placeholder:text-gray-600 rounded-2xl transition-all text-center text-2xl tracking-[0.5em] font-bold"
                />
                {errors.code && touched.code && (
                  <p className="text-[var(--mainRed)] text-xs mt-1 ml-1">
                    {errors.code}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label className="text-gray-300 ml-1 text-sm">
                    New Password
                  </Label>
                  <div className="relative">
                    <Field
                      name="password"
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/10 text-white h-14 pl-12 focus:ring-[var(--mainBlue)] focus:border-[var(--mainBlue)] placeholder:text-gray-600 rounded-2xl pr-12 transition-all"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-[var(--mainRed)] text-xs mt-1 ml-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label className="text-gray-300 ml-1 text-sm">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Field
                      name="password_confirmation"
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/10 text-white h-14 pl-12 focus:ring-[var(--mainBlue)] focus:border-[var(--mainBlue)] placeholder:text-gray-600 rounded-2xl pr-12 transition-all"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
                      <p className="text-[var(--mainRed)] text-xs mt-1 ml-1">
                        {errors.password_confirmation}
                      </p>
                    )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full h-14 bg-gradient-to-r from-[var(--mainBlue)] to-[#60A5FA] hover:opacity-90 text-white font-bold rounded-2xl text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] group mt-4"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>Reset Password</span>
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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--mainBlue)]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--mainRed)]/10 blur-[150px] rounded-full animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-2xl">
        <Suspense
          fallback={
            <Card className="bg-white/5 border-white/10 backdrop-blur-3xl h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/10 border-t-[var(--mainBlue)] rounded-full animate-spin"></div>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
