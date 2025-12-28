/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/accounts";
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
import { Mail, ArrowLeft, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--mainRed)]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--mainBlue)]/10 blur-[150px] rounded-full animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-lg">
        <Card className="bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="p-10 pb-4 text-center">
            <Link
              href="/login"
              className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-light"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
              <Mail className="h-8 w-8 text-[var(--mainRed)]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[var(--mainRed)] mb-4">
              <Sparkles className="h-3 w-3" />
              Secure Account Recovery
            </div>
            <CardTitle className="text-4xl font-bold text-white tracking-tight">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg mt-2 font-light">
              Enter your email and we&#39;ll send you a code to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await forgotPassword(values);
                  toast.success("Reset code sent to your email!");
                  router.push(
                    `/reset-password?email=${encodeURIComponent(values.email)}`
                  );
                } catch (error: any) {
                  console.error("Forgot password error:", error);
                  toast.error(
                    error.response?.data?.detail ||
                      "Failed to send reset code. Please try again."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-gray-300 ml-1 text-sm font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--mainRed)] transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <Field
                        name="email"
                        as={Input}
                        type="email"
                        placeholder="your@email.com"
                        className="bg-white/10 border-white/10 text-white h-14 pl-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-2xl transition-all"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-[var(--mainRed)] text-xs mt-1 ml-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full h-14 bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white font-bold rounded-2xl text-lg shadow-xl shadow-[var(--mainRed)]/20 transition-all active:scale-[0.98] group"
                  >
                    {isSubmitting || loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        <span>Send Reset Code</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-gray-500 text-sm font-light">
                      Remembered your password?{" "}
                      <Link
                        href="/login"
                        className="text-[var(--mainRed)] hover:underline font-medium"
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
    </div>
  );
}
